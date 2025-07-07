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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);

  // Request camera permission with improved mobile handling
  const requestCameraPermission = async () => {
    try {
      // More conservative settings for mobile devices
      const constraints = {
        video: isMobile ? {
          facingMode: 'environment',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        } : {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setHasPermission(true);
      setStream(mediaStream);
      return true;
    } catch (error: unknown) {
      console.error("Camera permission error:", error);
      setHasPermission(false);
      
      // Improved error handling for mobile devices
      let errorMessage = "Camera access denied";
      let userAction = "Please grant camera permission and try again";
      
      if (error instanceof Error && error.name === 'NotReadableError') {
        if (isMobile) {
          errorMessage = "Camera is busy or unavailable";
          userAction = "Please close other apps using the camera (like Instagram, WhatsApp, or video calls) and try again. You can also try using the file selection option.";
        } else {
          errorMessage = "Camera is being used by another application";
          userAction = "Please close other applications using the camera (like Zoom, Skype, or other browser tabs) and try again";
        }
      } else if (error instanceof Error && error.name === 'NotAllowedError') {
        if (isMobile) {
          errorMessage = "Camera permission denied";
          userAction = "Please allow camera access in your browser settings. On mobile, you may need to refresh the page after granting permission.";
        } else {
          errorMessage = "Camera permission denied";
          userAction = "Please click the camera icon in your browser's address bar and allow camera access";
        }
      } else if (error instanceof Error && error.name === 'NotFoundError') {
        errorMessage = "No camera found";
        userAction = isMobile ? "Please try using the file selection option to scan barcodes from photos" : "Please connect a camera and try again";
      }
      
      setError(`${errorMessage}. ${userAction}`);
      toast.error(errorMessage);
      return false;
    }
  };

  const startScanning = async () => {
    setError(null);
    setScannedProduct(null);

    // Request permission if not already granted
    if (hasPermission === null || hasPermission === false) {
      const granted = await requestCameraPermission();
      if (!granted) return;
    }

    setIsScanning(true);

    // Wait for the DOM element to be created before initializing scanner
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

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    
    // Stop video stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
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

  const onScanFailure = (error: string) => {
    // Handle scan failure, usually better to ignore
    console.log("Scan failed:", error);
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
    // Cleanup function only
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
          {hasPermission === false && (
            <div className={Styles.errorMessage}>
              <p>Camera permission is required for barcode scanning.</p>
              <button onClick={requestCameraPermission} className={Styles.retryButton}>
                Grant Camera Permission
              </button>
            </div>
          )}
          {(hasPermission === null || hasPermission === true) && (
            <button onClick={startScanning} className={Styles.startButton}>
              <Camera size={20} style={{ marginRight: '8px' }} />
              Start Scanning
            </button>
          )}
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
