import { create } from 'zustand';
import { QrScannerStore, QrScannerConfig } from '@/types/scanner';
import { formatScanResult, saveToHistory, getHistory, saveLastCamera, getLastCamera } from '@/utils/qr-scanner';

export const useScannerStore = create<QrScannerStore>((set) => ({
  // State
  isScanning: false,
  isLoading: false,
  error: null,
  lastResult: null,
  history: [],
  hasPermission: null,
  availableCameras: [],
  selectedCameraId: null,

  // Actions
  startScanning: async (_config?: QrScannerConfig) => {
    set({ isLoading: true, error: null });
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser. Please use Chrome, Firefox, Safari, or Edge with HTTPS.');
      }

      // Check if we're in a secure context (HTTPS or localhost)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        throw new Error('Camera access requires HTTPS. Please use HTTPS or localhost for testing.');
      }

      // Check camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      
      // Get available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      // Use last selected camera or default to first available
      const lastCamera = getLastCamera();
      const selectedCamera = lastCamera && cameras.find(c => c.deviceId === lastCamera) 
        ? lastCamera 
        : cameras[0]?.deviceId || null;

      set({
        hasPermission: true,
        availableCameras: cameras,
        selectedCameraId: selectedCamera,
        isScanning: true,
        isLoading: false,
        history: getHistory()
      });

      if (selectedCamera) {
        saveLastCamera(selectedCamera);
      }
    } catch (error) {
      let errorMessage = 'Camera access failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera access denied. Please allow camera access and try again.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found. Please connect a camera and try again.';
            break;
          case 'NotSupportedError':
            errorMessage = 'Camera is not supported in this browser.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is already in use by another application.';
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      set({
        hasPermission: false,
        error: errorMessage,
        isLoading: false,
        isScanning: false
      });
    }
  },

  stopScanning: async () => {
    set({
      isScanning: false,
      isLoading: false,
      error: null
    });
  },

  scanFromFile: async (file: File) => {
    set({ isLoading: true, error: null });
    
    try {
      // Dynamic import to avoid SSR issues
      const { Html5Qrcode } = await import('html5-qrcode');
      
      const html5QrCode = new Html5Qrcode('temp-file-scanner');
      const result = await html5QrCode.scanFile(file, true);
      
      const scanResult = formatScanResult(result, 'FILE_SCAN');
      const updatedHistory = saveToHistory(scanResult);
      
      set({
        lastResult: scanResult,
        history: updatedHistory,
        isLoading: false
      });
      
      html5QrCode.clear();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan file';
      set({
        error: errorMessage,
        isLoading: false
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearHistory: () => {
    set({ history: [] });
  },

  setSelectedCamera: (cameraId: string) => {
    set({ selectedCameraId: cameraId });
    saveLastCamera(cameraId);
  }
}));