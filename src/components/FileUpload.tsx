'use client';

import { useRef, useState } from 'react';
import { useScannerStore } from '@/store/scanner-store';
import toast from 'react-hot-toast';

interface FileUploadProps {
  className?: string;
}

export default function FileUpload({ className = '' }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { scanFromFile } = useScannerStore();

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsProcessing(true);
    
    try {
      await scanFromFile(file);
      toast.success('File processed successfully!');
    } catch {
      toast.error('Failed to scan QR code from image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      <div
        onClick={openFileSelector}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer transition-all duration-200 ease-in-out
          border-2 border-dashed rounded-xl p-8 text-center
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Processing Image...</h3>
              <p className="text-gray-600">Scanning for QR codes</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">
              {dragActive ? '📎' : '🖼️'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {dragActive ? 'Drop image here' : 'Upload QR Code Image'}
              </h3>
              <p className="text-gray-600 mb-4">
                Select or drag & drop an image containing a QR code
              </p>
              <div className="text-sm text-gray-500">
                <p>Supported formats: JPG, PNG, GIF, WebP</p>
                <p>Max size: 10MB</p>
              </div>
            </div>
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Choose File
            </button>
          </div>
        )}

        {/* Hidden temp scanner element for file scanning */}
        <div id="temp-file-scanner" className="hidden"></div>
      </div>

      {/* Additional Upload Tips */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">💡 Tips for better scanning:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Ensure the QR code is clearly visible</li>
          <li>• Avoid blurry or low-resolution images</li>
          <li>• Make sure there&apos;s good contrast</li>
          <li>• Crop the image to focus on the QR code</li>
        </ul>
      </div>
    </div>
  );
}