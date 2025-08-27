'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScannerStore } from '@/store/scanner-store';
import { QrScannerConfig, QrScanResult } from '@/types/scanner';
import { formatScanResult, saveToHistory } from '@/utils/qr-scanner';
import toast from 'react-hot-toast';

interface UseQRScannerOptions {
  onSuccess?: (result: QrScanResult) => void;
  onError?: (error: string) => void;
  config?: QrScannerConfig;
  elementId?: string;
}

export const useQRScanner = (options: UseQRScannerOptions = {}) => {
  const {
    onSuccess,
    onError,
    config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true
    },
    elementId = 'qr-scanner'
  } = options;

  const html5QrCodeRef = useRef<unknown>(null);
  const {
    isScanning,
    isLoading,
    error,
    selectedCameraId,
    startScanning,
    stopScanning,
    clearError
  } = useScannerStore();

  const handleScanSuccess = useCallback((decodedText: string, decodedResult: unknown) => {
    const formatName = (decodedResult as any)?.result?.format?.formatName;
    const result = formatScanResult(decodedText, formatName);
    const updatedHistory = saveToHistory(result);
    
    // Update store
    useScannerStore.setState({ 
      lastResult: result,
      history: updatedHistory 
    });

    // Call success callback
    onSuccess?.(result);
    
    // Show success toast
    toast.success('QR Code scanned successfully!');
  }, [onSuccess]);

  const handleScanError = useCallback((errorMessage: string) => {
    // Only show errors that are not common scanning "errors"
    if (!errorMessage.includes('NotFoundException') && 
        !errorMessage.includes('No MultiFormat Readers')) {
      console.warn('QR Scan Error:', errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  const initializeScanner = useCallback(async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { Html5Qrcode } = await import('html5-qrcode');
      
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      }

      html5QrCodeRef.current = new Html5Qrcode(elementId);
      
      const cameraId = selectedCameraId || { facingMode: "environment" };
      
      await html5QrCodeRef.current.start(
        cameraId,
        config,
        handleScanSuccess,
        handleScanError
      );
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize scanner';
      useScannerStore.setState({ error: errorMessage, isScanning: false, isLoading: false });
      toast.error(errorMessage);
    }
  }, [selectedCameraId, config, elementId, handleScanSuccess, handleScanError]);

  const start = useCallback(async () => {
    await startScanning(config);
  }, [startScanning, config]);

  const stop = useCallback(async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    } catch (error) {
      console.warn('Error stopping scanner:', error);
    }
    await stopScanning();
  }, [stopScanning]);

  const switchCamera = useCallback(async (cameraId: string) => {
    if (isScanning && html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        useScannerStore.setState({ selectedCameraId: cameraId });
        await initializeScanner();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to switch camera';
        toast.error(errorMessage);
      }
    }
  }, [isScanning, initializeScanner]);

  // Initialize scanner when scanning starts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && isScanning && !isLoading && !html5QrCodeRef.current) {
      initializeScanner();
    }
  }, [isScanning, isLoading, initializeScanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(console.warn);
        html5QrCodeRef.current.clear();
      }
    };
  }, []);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return {
    isScanning,
    isLoading,
    error,
    start,
    stop,
    switchCamera,
    clearError
  };
};