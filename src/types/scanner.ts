export interface QrScanResult {
  text: string;
  timestamp: number;
  format?: string;
}

export interface QrScannerConfig {
  fps?: number;
  qrbox?: {
    width: number;
    height: number;
  };
  aspectRatio?: number;
  disableFlip?: boolean;
  rememberLastUsedCamera?: boolean;
  supportedScanTypes?: Html5QrcodeScanType[];
  showTorchButtonIfSupported?: boolean;
  formatsToSupport?: Html5QrcodeSupportedFormats[];
}

export interface QrScannerState {
  isScanning: boolean;
  isLoading: boolean;
  error: string | null;
  lastResult: QrScanResult | null;
  history: QrScanResult[];
  hasPermission: boolean | null;
  availableCameras: MediaDeviceInfo[];
  selectedCameraId: string | null;
}

export interface QrScannerActions {
  startScanning: (config?: QrScannerConfig) => Promise<void>;
  stopScanning: () => Promise<void>;
  scanFromFile: (file: File) => Promise<void>;
  clearError: () => void;
  clearHistory: () => void;
  setSelectedCamera: (cameraId: string) => void;
}

export type QrScannerStore = QrScannerState & QrScannerActions;

// Re-export types from html5-qrcode
export enum Html5QrcodeScanType {
  SCAN_TYPE_CAMERA = 0,
  SCAN_TYPE_FILE = 1
}

export enum Html5QrcodeSupportedFormats {
  QR_CODE = 0,
  AZTEC = 1,
  CODABAR = 2,
  CODE_39 = 3,
  CODE_93 = 4,
  CODE_128 = 5,
  DATA_MATRIX = 6,
  MAXICODE = 7,
  ITF = 8,
  EAN_13 = 9,
  EAN_8 = 10,
  PDF_417 = 11,
  RSS_14 = 12,
  RSS_EXPANDED = 13,
  UPC_A = 14,
  UPC_E = 15,
  UPC_EAN_EXTENSION = 16
}