import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { TextEditor } from './components/TextEditor';
import { SharedItemList } from './components/SharedItemList';
import { ReceivePanel } from './components/ReceivePanel';
import { SharedItem, FileItem } from './types';
import { nanoid } from 'nanoid';
import { Zap, Github } from 'lucide-react';
import { generateShareCode, storeItem, removeItem } from './utils/shareCode';
import { Button } from './components/Button';
import { IntroText } from './components/IntroText';

function App() {
  const [items, setItems] = useState<SharedItem[]>([]);
  const [text, setText] = useState('');

  const simulateUpload = async (file: File, id: string) => {
    const chunks = 10;
    for (let i = 0; i <= chunks; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, uploadProgress: (i / chunks) * 100 }
            : item
        )
      );
    }
  };

  const handleFileSelect = async (files: File[]) => {
    const newItems: FileItem[] = await Promise.all(
      files.map(async (file) => {
        const id = nanoid();
        const shareCode = generateShareCode();
        const item: FileItem = {
          id,
          type: 'file',
          name: file.name,
          content: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
          createdAt: new Date(),
          shareCode,
          uploadProgress: 0,
        };
        storeItem(shareCode, item);
        simulateUpload(file, id);
        return item;
      })
    );
    setItems((prev) => [...newItems, ...prev]);
  };

  const handleTextShare = () => {
    if (!text.trim()) return;
    
    const shareCode = generateShareCode();
    const newItem: SharedItem = {
      id: nanoid(),
      type: 'text',
      name: `Text Snippet ${new Date().toLocaleTimeString()}`,
      content: text,
      createdAt: new Date(),
      shareCode,
    };
    
    storeItem(shareCode, newItem);
    setItems((prev) => [newItem, ...prev]);
    setText('');
  };

  const handleDelete = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item?.shareCode) {
      removeItem(item.shareCode);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-dark text-white font-mono">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Zap className="w-8 sm:w-10 h-8 sm:h-10 text-primary animate-glow" />
              <h1 className="text-3xl sm:text-4xl font-bold text-primary">SpeedShare</h1>
            </div>
            <IntroText />
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <ReceivePanel />

          <div className="bg-dark-lighter p-4 sm:p-8 rounded-xl border border-primary/10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Share Files</h2>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          <div className="bg-dark-lighter p-4 sm:p-8 rounded-xl border border-primary/10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Share Text</h2>
            <div className="space-y-4">
              <TextEditor value={text} onChange={setText} />
              <Button
                onClick={handleTextShare}
                disabled={!text.trim()}
                tooltip="Share text content with others"
              >
                Share Text
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="bg-dark-lighter p-4 sm:p-8 rounded-xl border border-primary/10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Shared Items</h2>
              <SharedItemList items={items} onDelete={handleDelete} />
            </div>
          )}
        </div>
        
        <div className="mb-12"></div>
        
        <div className="relative bottom-4 left-1/2 transform -translate-x-1/2">
          <a
            href="https://github.com/Manish-Let-It-Be"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="secondary"
              tooltip="Visit GitHub profile"
              className="flex items-center space-x-2 text-sm"
            >
              <Github className="w-4 h-4" />
              <span>by Manish</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;