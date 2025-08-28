"use client";

import { useEffect, useState, useCallback } from "react";
import { useQRScanner } from "@/hooks/useQRScanner";
import { useScannerStore } from "@/store/scanner-store";
import { QrScanResult } from "@/types/scanner";
import CameraControls from "./CameraControls";
import FileUpload from "./FileUpload";
import ScanResult from "./ScanResult";
import BrowserSupportCheck from "./BrowserSupportCheck";
import toast from "react-hot-toast";

interface QRScannerProps {
	onScanSuccess?: (result: QrScanResult) => void;
	className?: string;
}

export default function QRScanner({ onScanSuccess, className = "" }: QRScannerProps) {
	const [activeTab, setActiveTab] = useState<"camera" | "file">("camera");
	const [browserSupported, setBrowserSupported] = useState(false);
	const { availableCameras, hasPermission, lastResult } = useScannerStore();

	const { isScanning, isLoading, error, start, stop, switchCamera, clearError } = useQRScanner({
		onSuccess: (result) => {
			onScanSuccess?.(result);
			toast.success(`Scanned: ${result.text.substring(0, 50)}${result.text.length > 50 ? "..." : ""}`);
		},
		onError: (errorMsg) => {
			toast.error(errorMsg);
		},
		config: {
			fps: 10,
			qrbox: { width: 280, height: 280 },
			aspectRatio: 1.0,
			rememberLastUsedCamera: true,
			showTorchButtonIfSupported: true,
		},
	});

	const handleStartScanning = useCallback(async () => {
		try {
			await start();
		} catch {
			toast.error("Failed to start camera");
		}
	}, [start]);

	const handleStopScanning = useCallback(async () => {
		try {
			await stop();
		} catch (err) {
			console.warn("Error stopping scanner:", err);
		}
	}, [stop]);

	// Auto-start camera scanning on mount if permission exists
	useEffect(() => {
		if (hasPermission && !isScanning && activeTab === "camera") {
			handleStartScanning();
		}
	}, [hasPermission, activeTab]);

	return (
		<div>
			<div className="p-6">
				{/* Error Display */}
				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex justify-between items-center">
							<p className="text-red-800 text-sm">{error}</p>
							<button onClick={clearError} className="text-red-600 hover:text-red-800 text-lg font-bold">
								×
							</button>
						</div>
					</div>
				)}

				
					<div className="space-y-4">
						{/* Camera Scanner */}
						<div className="relative">
							{!browserSupported ? (
								<BrowserSupportCheck onSupported={() => setBrowserSupported(true)}>
									{!hasPermission && (
										<div className="bg-gray-100 rounded-xl p-8 text-center">
											<div className="text-6xl mb-4">📷</div>
											<h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
											<p className="text-gray-600 mb-4">Allow camera access to scan QR codes</p>
											<button
												onClick={handleStartScanning}
												disabled={isLoading}
												className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{isLoading ? "Requesting Access..." : "Enable Camera"}
											</button>
										</div>
									)}
								</BrowserSupportCheck>
							) : (
								<>
									{!hasPermission && (
										<div className="bg-gray-100 rounded-xl p-8 text-center">
											<div className="text-6xl mb-4">📷</div>
											<h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
											<p className="text-gray-600 mb-4">Allow camera access to scan QR codes</p>
											<button
												onClick={handleStartScanning}
												disabled={isLoading}
												className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{isLoading ? "Requesting Access..." : "Enable Camera"}
											</button>
										</div>
									)}
								</>
							)}

							{hasPermission && browserSupported && (
								<>
									{/* Scanner Container */}
									<div className="relative bg-gray-900 rounded-xl overflow-hidden">
										<div id="qr-scanner" className="w-full h-80">
											{isLoading && (
												<div className="absolute inset-0 flex items-center justify-center bg-gray-900">
													<div className="text-white text-center">
														<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
														<p>Starting camera...</p>
													</div>
												</div>
											)}
										</div>

										{/* Overlay Instructions */}
										{isScanning && (
											<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
												<p className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">Position QR code within the square</p>
											</div>
										)}
									</div>

									{/* Camera Controls */}
									<CameraControls
										isScanning={isScanning}
										availableCameras={availableCameras}
										onCameraChange={switchCamera}
										onStart={handleStartScanning}
										onStop={handleStopScanning}
										className="mt-4"
									/>
								</>
							)}
						</div>
					</div>
				

				{/* Scan Result */}
				{lastResult && <ScanResult result={lastResult} className="mt-6" />}
			</div>
		</div>
	);
}
