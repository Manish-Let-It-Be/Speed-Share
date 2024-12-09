import React from 'react';
import { FileItem, SharedItem } from '../types';
import { FileText, File, Download, Trash2 } from 'lucide-react';
import { ShareLink } from './ShareLink';
import { ProgressBar } from './ProgressBar';

interface SharedItemListProps {
  items: SharedItem[];
  onDelete: (id: string) => void;
}

export function SharedItemList({ items, onDelete }: SharedItemListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-6 bg-dark-lighter rounded-lg border border-primary/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              {item.type === 'file' ? (
                <File className="w-6 h-6 text-primary flex-shrink-0" />
              ) : (
                <FileText className="w-6 h-6 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-primary truncate pr-4">{item.name}</h3>
                {item.type === 'file' && (
                  <p className="text-sm text-primary/60">
                    {formatFileSize((item as FileItem).size)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2 flex-shrink-0">
              {item.type === 'file' && (
                <button
                  className="p-2 text-primary/60 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                  onClick={() => window.open(item.content, '_blank')}
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button
                className="p-2 text-primary/60 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          {item.uploadProgress !== undefined && item.uploadProgress < 100 && (
            <ProgressBar progress={item.uploadProgress} />
          )}
          <ShareLink shareCode={item.shareCode} content={item.content} type={item.type} />
        </div>
      ))}
    </div>
  );
}