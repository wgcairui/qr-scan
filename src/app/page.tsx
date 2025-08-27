'use client';

import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import ScanHistory from '@/components/ScanHistory';
import { QrScanResult } from '@/types/scanner';

export default function Home() {
  const [activeView, setActiveView] = useState<'scanner' | 'history'>('scanner');

  const handleScanSuccess = (result: QrScanResult) => {
    console.log('Scan result:', result);
    // Additional handling can be added here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-2">
                <span className="text-white text-2xl">📱</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Quick QR Scanner</h1>
                <p className="text-sm text-gray-600">Fast & Reliable QR Code Reader</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('scanner')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'scanner'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Scanner
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'history'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                History
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeView === 'scanner' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
                Scan QR Codes Instantly
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Use your camera to scan QR codes in real-time or upload an image file. 
                Fast, secure, and works on all devices.
              </p>
            </div>

            {/* Scanner Component */}
            <div className="flex justify-center">
              <QRScanner onScanSuccess={handleScanSuccess} />
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">
                  Instant QR code recognition with optimized scanning algorithms
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="font-semibold text-gray-800 mb-2">Privacy First</h3>
                <p className="text-gray-600 text-sm">
                  All scanning happens locally on your device. No data is sent to servers.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="font-semibold text-gray-800 mb-2">Works Everywhere</h3>
                <p className="text-gray-600 text-sm">
                  Compatible with all modern browsers and mobile devices
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <ScanHistory />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              Built with Next.js, React, and html5-qrcode library
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <a 
                href="https://github.com/mebjas/html5-qrcode" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                html5-qrcode
              </a>
              <a 
                href="https://nextjs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Next.js
              </a>
              <a 
                href="https://tailwindcss.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Tailwind CSS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
