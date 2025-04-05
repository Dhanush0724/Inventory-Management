// components/BarcodeScanner.tsx
import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Props {
  onDetected: (barcode: string) => void;
}

const BarcodeScanner: React.FC<Props> = ({ onDetected }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeScanner = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    html5QrCodeScanner.current = new Html5QrcodeScanner(
      scannerRef.current.id,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    html5QrCodeScanner.current.render(
      (decodedText) => {
        onDetected(decodedText);
        html5QrCodeScanner.current?.clear(); // Stop scanning after detection
      },
      (errorMessage) => {
        // Optionally log scan errors
        console.warn(errorMessage);
      }
    );

    return () => {
      html5QrCodeScanner.current?.clear().catch(console.error);
    };
  }, [onDetected]);

  return <div id="scanner" ref={scannerRef} className="w-full h-[300px]" />;
};

export default BarcodeScanner;
