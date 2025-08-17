import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const QRShare = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Simple QR code representation using CSS
  const generateQRPattern = (text) => {
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const pattern = [];
    for (let i = 0; i < 144; i++) {
      pattern.push((hash + i) % 3 === 0);
    }
    return pattern;
  };

  const qrPattern = generateQRPattern(url);

  return (
    <div className="space-y-4">
      {/* QR Code */}
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-lg shadow-inner">
          <div className="grid grid-cols-12 gap-1 w-24 h-24">
            {qrPattern.map((filled, index) => (
              <div
                key={index}
                className={`w-1 h-1 ${filled ? 'bg-gray-900' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* URL and Copy Button */}
      <div className="space-y-2">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
          <p className="text-xs text-gray-600 dark:text-gray-300 break-all">
            {url}
          </p>
        </div>
        
        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QRShare;