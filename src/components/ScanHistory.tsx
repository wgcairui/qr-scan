'use client';

import { useScannerStore } from '@/store/scanner-store';
import { copyToClipboard, detectContentType } from '@/utils/qr-scanner';
import toast from 'react-hot-toast';

interface ScanHistoryProps {
  className?: string;
}

export default function ScanHistory({ className = '' }: ScanHistoryProps) {
  const { history, clearHistory } = useScannerStore();

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Copied to clipboard!');
    } else {
      toast.error('Failed to copy');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (history.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-2">📋</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No scan history</h3>
        <p className="text-gray-500">Your scanned QR codes will appear here</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Scan History</h2>
        <button
          onClick={() => {
            clearHistory();
            toast.success('History cleared');
          }}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* History List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((item, index) => {
          const contentType = detectContentType(item.text);
          
          return (
            <div
              key={`${item.timestamp}-${index}`}
              className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-1">
                  {getContentIcon(contentType)}
                </span>
                
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm break-all">
                    {truncateText(item.text)}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{formatTimestamp(item.timestamp)}</span>
                    {item.format && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {item.format}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(item.text)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                  
                  {contentType === 'url' && (
                    <button
                      onClick={() => window.open(item.text, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Open link"
                    >
                      🚀
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Showing {history.length} recent scan{history.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}