import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { retrieveItem } from '../utils/shareCode';
import { Button } from './Button';

export function ReceivePanel() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReceive = async () => {
    setLoading(true);
    setError('');
    try {
      const item = await retrieveItem(code.toUpperCase());
      
      if (!item) {
        setError('Invalid code. Please check and try again.');
        return;
      }

      if (item.type === 'text') {
        const textContent = item.content;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Shared Text Content</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: monospace;
                    padding: 1rem;
                    margin: 0;
                    background: #0a0a0a;
                    color: #00a2ff;
                    min-height: 100vh;
                    box-sizing: border-box;
                  }
                  .container {
                    max-width: 800px;
                    margin: 0 auto;
                  }
                  pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    background: #1a1a1a;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                    overflow-x: auto;
                  }
                  button {
                    background: #00a2ff;
                    color: #0a0a0a;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 1rem;
                    transition: background-color 0.2s;
                  }
                  button:hover {
                    background: #0077cc;
                  }
                  @media (max-width: 640px) {
                    body {
                      padding: 0.5rem;
                    }
                    pre {
                      padding: 0.5rem;
                      font-size: 0.875rem;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <pre>${textContent}</pre>
                  <button onclick="navigator.clipboard.writeText(document.querySelector('pre').textContent).then(() => alert('Copied to clipboard!'))">
                    Copy to Clipboard
                  </button>
                </div>
              </body>
            </html>
          `);
          newWindow.document.close();
        }
      } else if (item.type === 'file' && item.url) {
        window.open(item.url, '_blank');
      }
      
      setCode('');
    } catch (err) {
      console.error('Error retrieving item:', err);
      setError('Failed to retrieve the shared item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-lighter p-4 sm:p-8 rounded-xl border border-primary/10">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Receive Files</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="flex-1 bg-dark p-3 rounded-lg text-primary border border-primary/20 
                   placeholder-primary/40 focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button
          onClick={handleReceive}
          disabled={code.length !== 6 || loading}
          tooltip="Download shared content"
          className="flex items-center justify-center space-x-2"
        >
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Receive</span>
            </>
          )}
        </Button>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}