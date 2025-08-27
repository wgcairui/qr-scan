'use client';

import { useEffect, useState } from 'react';
import { checkBrowserSupport, getBrowserInfo, getCameraPermissionInstructions, BrowserSupportInfo } from '@/utils/browser-support';

interface BrowserSupportCheckProps {
  onSupported: () => void;
  children?: React.ReactNode;
}

export default function BrowserSupportCheck({ onSupported, children }: BrowserSupportCheckProps) {
  const [supportInfo, setSupportInfo] = useState<BrowserSupportInfo | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check support after component mounts (client-side only)
    const checkSupport = () => {
      const info = checkBrowserSupport();
      setSupportInfo(info);
      setIsChecking(false);
      
      if (info.isSupported) {
        onSupported();
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(checkSupport, 100);
    return () => clearTimeout(timer);
  }, [onSupported]);

  if (isChecking) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking browser compatibility...</p>
      </div>
    );
  }

  if (!supportInfo || supportInfo.isSupported) {
    return <>{children}</>;
  }

  const browser = getBrowserInfo();
  const permissionInstructions = getCameraPermissionInstructions(browser);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Browser Compatibility Issue
          </h3>
          
          {supportInfo.errorMessage && (
            <p className="text-yellow-700 mb-4">
              {supportInfo.errorMessage}
            </p>
          )}

          <div className="space-y-4">
            {/* Browser Status */}
            <div className="bg-white rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-800">Browser Status:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${supportInfo.isSecureContext ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  HTTPS/Secure Context
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${supportInfo.hasMediaDevices ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  MediaDevices API
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${supportInfo.hasGetUserMedia ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Camera Access API
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Browser: {browser}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {supportInfo.suggestions.length > 0 && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Recommendations:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {supportInfo.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Permission Instructions */}
            {supportInfo.hasGetUserMedia && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Camera Permission Instructions:</h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  {permissionInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 font-medium">{index + 1}.</span>
                      <span>{instruction.replace(/^\d+\.\s*/, '')}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* File Upload Alternative */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Alternative Option:</h4>
              <p className="text-blue-700 text-sm">
                You can still use the <strong>File Upload</strong> feature to scan QR codes from images, 
                even if camera access isn't available.
              </p>
            </div>

            {/* Retry Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsChecking(true);
                  setSupportInfo(null);
                  // Recheck after a small delay
                  setTimeout(() => {
                    const info = checkBrowserSupport();
                    setSupportInfo(info);
                    setIsChecking(false);
                    if (info.isSupported) {
                      onSupported();
                    }
                  }, 500);
                }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🔄 Check Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}