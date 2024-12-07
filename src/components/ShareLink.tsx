import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from './Button';

interface ShareLinkProps {
  shareCode: string | undefined;
  content: string;
  type: 'file' | 'text';
}

export function ShareLink({ shareCode }: ShareLinkProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2 bg-dark p-3 rounded-lg">
        {shareCode && (
          <>
            <div className="flex-1 min-w-[200px]">
              <p className="text-primary text-sm mb-1">Share Code:</p>
              <p className="font-mono text-xl text-primary">{shareCode}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="icon"
                onClick={() => copyToClipboard(shareCode)}
                tooltip="Copy share code"
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}