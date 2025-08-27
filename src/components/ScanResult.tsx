'use client';

import { useState } from 'react';
import { QrScanResult } from '@/types/scanner';
import { copyToClipboard, detectContentType, getActionForContentType } from '@/utils/qr-scanner';
import toast from 'react-hot-toast';

interface ScanResultProps {
  result: QrScanResult;
  className?: string;
}

export default function ScanResult({ result, className = '' }: ScanResultProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const contentType = detectContentType(result.text);
  const action = getActionForContentType(contentType, result.text);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(result.text);
    if (success) {
      setIsCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleAction = () => {
    if (action.label === 'Copy') {
      handleCopy();
    } else {
      action.action();
      toast.success(`${action.label} executed`);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return isExpanded ? text : text.substring(0, maxLength) + '...';
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'url': return '🔗';
      case 'email': return '📧';
      case 'phone': return '📞';
      case 'wifi': return '📶';
      default: return '📄';
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'url': return 'Website Link';
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      case 'wifi': return 'WiFi Network';
      default: return 'Text Content';
    }
  };

  return (
    <div className={`bg-green-50 border border-green-200 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getContentIcon(contentType)}</span>
          <div>
            <h3 className="font-semibold text-green-800">Scan Successful!</h3>
            <p className="text-sm text-green-600">{getContentTypeLabel(contentType)}</p>
          </div>
        </div>
        <div className="text-xs text-green-600">
          {formatTimestamp(result.timestamp)}
        </div>
      </div>

      {/* Content Display */}
      <div className="mb-4">
        <div className="bg-white rounded-lg p-3 border">
          <p className="text-gray-800 break-all font-mono text-sm leading-relaxed">
            {truncateText(result.text)}
          </p>
          
          {result.text.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {result.format && (
          <p className="text-xs text-green-600 mt-2">
            Format: {result.format}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAction}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          {action.label === 'Copy' ? (isCopied ? '✓' : '📋') : '🚀'}
          {isCopied ? 'Copied!' : action.label}
        </button>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          title="Copy to clipboard"
        >
          {isCopied ? '✓' : '📋'}
        </button>

        {contentType === 'url' && (
          <button
            onClick={() => {
              navigator.share?.({
                title: 'Scanned QR Code',
                text: result.text,
                url: result.text
              }).catch(() => {
                // Fallback - copy to clipboard
                handleCopy();
              });
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            title="Share"
          >
            📤
          </button>
        )}
      </div>

      {/* Additional Info for Special Content Types */}
      {contentType === 'wifi' && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> WiFi connection requires a compatible app or manual setup.
          </p>
        </div>
      )}
    </div>
  );
}