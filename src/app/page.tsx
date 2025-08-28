"use client";

import { useState } from "react";
import QRScanner from "@/components/QRScanner";
import ScanHistory from "@/components/ScanHistory";
import { QrScanResult } from "@/types/scanner";

export default function Home() {
	const [activeView, setActiveView] = useState<"scanner" | "history">("scanner");

	const handleScanSuccess = (result: QrScanResult) => {
		console.log("Scan result:", result);
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
							</div>
						</div>

						{/* Navigation */}
						<div className="flex bg-gray-100 rounded-lg p-1">
							<button
								onClick={() => setActiveView("scanner")}
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === "scanner" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
							>
								Scanner
							</button>
							<button
								onClick={() => setActiveView("history")}
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === "history" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
							>
								History
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-4 py-8">
				{activeView === "scanner" ? (
					<div className="space-y-8">
						{/* Scanner Component */}
						<div className="flex justify-center">
							<QRScanner onScanSuccess={handleScanSuccess} />
						</div>
					</div>
				) : (
					<div className="max-w-2xl mx-auto">
						<ScanHistory />
					</div>
				)}
			</main>
		</div>
	);
}
