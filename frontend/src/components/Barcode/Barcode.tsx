"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import { openFoodFactsService, OpenFoodFactsProduct } from "@/services/openFoodFactsService";
import { ProductDisplay } from "./ProductDisplay";
import Styles from "./Barcode.module.css";

export const Barcode: React.FC = () => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerId = useRef(`barcode-scanner-${Date.now()}`);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<OpenFoodFactsProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startScanning = () => {
    setError(null);
    setScannedProduct(null);
    setIsScanning(true);

    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        scannerId.current,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
          supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_CAMERA,
            Html5QrcodeScanType.SCAN_TYPE_FILE
          ]
        },
        false
      );

      scanner.render(onScanSuccess, (errorMessage) => {
        console.warn("Scan error:", errorMessage);

        if (errorMessage.includes("NotReadableError")) {
          setError("Камера занята другим приложением. Закрой WhatsApp, Instagram, Zoom и попробуй снова.");
          toast.error("Камера недоступна");
          stopScanning();
        } else if (errorMessage.includes("NotAllowedError")) {
          setError("Разреши доступ к камере в настройках браузера.");
          toast.error("Нет доступа к камере");
          stopScanning();
        }
      });

      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }

    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log("Scanned barcode:", decodedText);
    setIsLoading(true);
    stopScanning();

    try {
      const response = await openFoodFactsService.getProductByBarcode(decodedText);

      if (response.status === 1 && response.product) {
        setScannedProduct(response.product);
        toast.success("Product found!");
      } else {
        setError("Product not found in Open Food Facts database");
        toast.error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product information");
      toast.error("Failed to fetch product information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseProduct = () => {
    setScannedProduct(null);
    setError(null);
  };

  const handleTryAgain = () => {
    setError(null);
    startScanning();
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  if (scannedProduct) {
    return <ProductDisplay product={scannedProduct} onClose={handleCloseProduct} />;
  }

  return (
    <div className={Styles.barcodeContainer}>
      <div className={Styles.header}>
        <h1>Barcode Scanner</h1>
        <p>Scan a product barcode or upload an image to get information from Open Food Facts</p>
      </div>

      {error && (
        <div className={Styles.errorMessage}>
          <p>{error}</p>
          <div className={Styles.errorActions}>
            <button onClick={handleTryAgain} className={Styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className={Styles.loading}>
          <div className={Styles.spinner}></div>
          <p>Processing...</p>
        </div>
      )}

      {!isScanning && !isLoading && !error && (
        <div className={Styles.startSection}>
          <button onClick={startScanning} className={Styles.startButton}>
            <Camera size={20} style={{ marginRight: '8px' }} />
            Start Scanning
          </button>
        </div>
      )}

      {isScanning && (
        <div className={Styles.scannerSection}>
          <div id={scannerId.current} className={Styles.scanner}></div>
        </div>
      )}
    </div>
  );
};
