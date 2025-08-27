'use client';

import { useScannerStore } from '@/store/scanner-store';

interface CameraControlsProps {
  isScanning: boolean;
  availableCameras: MediaDeviceInfo[];
  onCameraChange: (cameraId: string) => void;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

export default function CameraControls({
  isScanning,
  availableCameras,
  onCameraChange,
  onStart,
  onStop,
  className = ''
}: CameraControlsProps) {
  const { selectedCameraId } = useScannerStore();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Camera Selection */}
      {availableCameras.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Camera
          </label>
          <select
            value={selectedCameraId || ''}
            onChange={(e) => onCameraChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isScanning}
          >
            {availableCameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId.slice(0, 8)}...`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!isScanning ? (
          <button
            onClick={onStart}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            ▶ Start Scanning
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            ⏹ Stop Scanning
          </button>
        )}
        
        {isScanning && (
          <button
            onClick={() => {
              // Toggle between front and back camera if available
              if (availableCameras.length >= 2) {
                const currentIndex = availableCameras.findIndex(c => c.deviceId === selectedCameraId);
                const nextIndex = (currentIndex + 1) % availableCameras.length;
                onCameraChange(availableCameras[nextIndex].deviceId);
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            disabled={availableCameras.length < 2}
          >
            🔄
          </button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}></div>
        <span className="text-sm text-gray-600">
          {isScanning ? 'Scanning active' : 'Scanner stopped'}
        </span>
      </div>
    </div>
  );
}