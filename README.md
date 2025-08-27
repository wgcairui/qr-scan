# 🔍 Quick QR Scanner

A fast, reliable, and privacy-focused QR code scanner built with Next.js and React. Scan QR codes using your camera in real-time or upload image files for instant detection.

## ✨ Features

- **⚡ Lightning Fast**: Instant QR code recognition with optimized scanning algorithms
- **📱 Camera Scanning**: Real-time QR code detection using device camera
- **🖼️ File Upload**: Scan QR codes from images (JPG, PNG, GIF, WebP)
- **🔒 Privacy First**: All processing happens locally - no data sent to servers
- **📋 Smart Actions**: Auto-detect URLs, emails, phone numbers, and WiFi networks
- **📚 Scan History**: Keep track of all your scanned codes with local storage
- **🎯 Multiple Formats**: Supports QR codes and various barcode formats
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🌐 Browser Compatible**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **QR Scanner**: [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Notifications**: [react-hot-toast](https://github.com/timolins/react-hot-toast)
- **Deployment**: [Vercel](https://vercel.com/)

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quick-qr-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📱 Usage

### Camera Scanning
1. Click the "Camera Scan" tab
2. Allow camera permissions when prompted
3. Point your camera at a QR code
4. The code will be automatically detected and displayed

### File Upload Scanning
1. Click the "File Scan" tab
2. Click "Choose File" or drag & drop an image
3. The QR code will be extracted and displayed

### Managing History
- View all scanned codes in the "History" tab
- Copy any previous scan result
- Clear history when needed

## 🔧 Configuration

### Camera Settings
The scanner supports various camera configurations:

```typescript
const config = {
  fps: 10, // Frames per second
  qrbox: { width: 280, height: 280 }, // Scanning area
  aspectRatio: 1.0, // Camera aspect ratio
  rememberLastUsedCamera: true, // Remember camera selection
  showTorchButtonIfSupported: true // Show flashlight button
};
```

### Supported Formats
- QR Code
- AZTEC
- CODE_39, CODE_93, CODE_128
- EAN_13, EAN_8
- UPC_A, UPC_E
- PDF_417
- DATA_MATRIX
- ITF

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Deploy with one click

The project is already optimized for Vercel deployment with proper configuration.

## 🙏 Acknowledgments

- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - Excellent QR code scanning library
- [ZXing](https://github.com/zxing/zxing) - Multi-format 1D/2D barcode image processing library
- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
# qr-scan
