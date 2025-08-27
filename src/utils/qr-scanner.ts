import { QrScanResult } from '@/types/scanner';

// Utility functions for QR scanner
export const isValidUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

export const formatScanResult = (text: string, format?: string): QrScanResult => ({
  text,
  timestamp: Date.now(),
  format
});

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch {
    return false;
  }
};

export const getStorageKey = (key: string) => `qr-scanner-${key}`;

export const saveToHistory = (result: QrScanResult) => {
  const history = getHistory();
  const updated = [result, ...history.filter(h => h.text !== result.text)].slice(0, 50);
  localStorage.setItem(getStorageKey('history'), JSON.stringify(updated));
  return updated;
};

export const getHistory = (): QrScanResult[] => {
  try {
    const stored = localStorage.getItem(getStorageKey('history'));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(getStorageKey('history'));
};

export const saveLastCamera = (cameraId: string) => {
  localStorage.setItem(getStorageKey('last-camera'), cameraId);
};

export const getLastCamera = (): string | null => {
  return localStorage.getItem(getStorageKey('last-camera'));
};

export const detectContentType = (text: string): 'url' | 'email' | 'phone' | 'wifi' | 'text' => {
  if (isValidUrl(text)) return 'url';
  if (text.includes('@') && text.includes('.')) return 'email';
  if (/^[\+]?[\d\s\-\(\)]+$/.test(text)) return 'phone';
  if (text.startsWith('WIFI:')) return 'wifi';
  return 'text';
};

export const getActionForContentType = (type: string, text: string) => {
  switch (type) {
    case 'url':
      return { label: 'Open Link', action: () => window.open(text, '_blank') };
    case 'email':
      return { label: 'Send Email', action: () => window.open(`mailto:${text}`) };
    case 'phone':
      return { label: 'Call', action: () => window.open(`tel:${text}`) };
    case 'wifi':
      return { label: 'WiFi Info', action: () => {} }; // WiFi connection would need native app
    default:
      return { label: 'Copy', action: () => copyToClipboard(text) };
  }
};