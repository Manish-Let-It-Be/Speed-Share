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

function App() {
  const [items, setItems] = useState<SharedItem[]>([]);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);

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
    setUploading(true);
    try {
      const newItems: FileItem[] = await Promise.all(
        files.map(async (file) => {
          const id = nanoid();
          const shareCode = generateShareCode();
          
          // Convert file to base64
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          const item: FileItem = {
            id,
            type: 'file',
            name: file.name,
            content: base64,
            size: file.size,
            mimeType: file.type,
            createdAt: new Date(),
            shareCode,
            uploadProgress: 0,
          };

          try {
            await storeItem(shareCode, item);
            simulateUpload(file, id);
            return item;
          } catch (error) {
            console.error('Error storing file:', error);
            throw error;
          }
        })
      );
      setItems((prev) => [...newItems, ...prev]);
    } catch (error) {
      console.error('Error handling files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTextShare = async () => {
    if (!text.trim()) return;
    
    setUploading(true);
    try {
      const shareCode = generateShareCode();
      const newItem: SharedItem = {
        id: nanoid(),
        type: 'text',
        name: `Text Snippet ${new Date().toLocaleTimeString()}`,
        content: text,
        createdAt: new Date(),
        shareCode,
      };
      
      await storeItem(shareCode, newItem);
      setItems((prev) => [newItem, ...prev]);
      setText('');
    } catch (error) {
      console.error('Error sharing text:', error);
      alert('Failed to share text. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const item = items.find(item => item.id === id);
      if (item?.shareCode) {
        await removeItem(item.shareCode);
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white font-mono relative pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <Zap className="w-8 sm:w-10 h-8 sm:h-10 text-primary animate-glow" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">SpeedShare</h1>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <ReceivePanel />

          <div className="bg-dark-lighter p-4 sm:p-8 rounded-xl border border-primary/10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Share Files</h2>
            <FileUpload onFileSelect={handleFileSelect} disabled={uploading} />
          </div>

          <div className="bg-dark-lighter p-4 sm:p-8 rounded-xl border border-primary/10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Share Text</h2>
            <div className="space-y-4">
              <TextEditor value={text} onChange={setText} />
              <Button
                onClick={handleTextShare}
                disabled={!text.trim() || uploading}
                tooltip="Share text content with others"
              >
                {uploading ? 'Sharing...' : 'Share Text'}
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
      </div>
      
      <footer className="flexed bottom-0 left-0 right-0 bg-dark-lighter border-t border-primary/10 py-4">
        <div className="flex justify-center">
          <a
            href="https://github.com/Manish-Let-It-Be"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="secondary"
              tooltip="Visit creator's GitHub profile"
              className="flex items-center space-x-2 text-sm"
            >
              <Github className="w-4 h-4" />
              <span>by Manish</span>
            </Button>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;