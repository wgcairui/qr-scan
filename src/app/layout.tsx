import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Quick QR Scanner - Fast & Reliable QR Code Scanner",
  description: "Scan QR codes instantly using your camera or upload images. Fast, secure, and works on all devices.",
  keywords: "QR scanner, barcode scanner, QR code reader, mobile scanner",
  authors: [{ name: "Quick QR Scanner" }],
  creator: "Quick QR Scanner",
  publisher: "Quick QR Scanner",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: "/qr-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/qr-icon.svg",
    apple: "/qr-icon.svg",
  },
  openGraph: {
    title: "Quick QR Scanner - Fast & Reliable QR Code Scanner",
    description: "Scan QR codes instantly using your camera or upload images. Fast, secure, and works on all devices.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick QR Scanner",
    description: "Fast & reliable QR code scanner for all devices",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased bg-gray-50 min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
