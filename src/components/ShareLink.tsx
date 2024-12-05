import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, QrCode, Link } from 'lucide-react';
import { Button } from './Button';

interface ShareLinkProps {
  shareCode: string | undefined;
  content: string;
  type: 'file' | 'text';
}

export function ShareLink({ shareCode, content, type }: ShareLinkProps) {
  const [showQR, setShowQR] = React.useState(false);
  const [showLink, setShowLink] = React.useState(false);

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}?code=${shareCode}`;

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
              <Button
                variant="icon"
                onClick={() => setShowQR(!showQR)}
                tooltip="Show QR code"
              >
                <QrCode className="w-5 h-5" />
              </Button>
              <Button
                variant="icon"
                onClick={() => setShowLink(!showLink)}
                tooltip="Generate share link"
              >
                <Link className="w-5 h-5" />
              </Button>
            </div>
          </>
        )}
      </div>
      
      {showQR && shareCode && (
        <div className="mt-4 p-4 bg-white rounded-lg inline-block">
          <QRCodeSVG value={shareUrl} size={200} />
        </div>
      )}

      {showLink && shareCode && (
        <div className="mt-4 p-4 bg-dark rounded-lg flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-dark-lighter p-2 rounded border border-primary/20 text-primary"
          />
          <Button
            variant="secondary"
            onClick={() => copyToClipboard(shareUrl)}
            tooltip="Copy share link"
          >
            Copy Link
          </Button>
        </div>
      )}
    </div>
  );
}