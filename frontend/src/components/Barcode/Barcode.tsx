"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";
import { Camera, Upload } from "lucide-react";
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

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);
      setStream(mediaStream);
      
      toast.success("Camera permission granted!");
      return true;
    } catch (error) {
      console.error("Camera permission denied:", error);
      setHasPermission(false);
      setError("Camera permission is required for barcode scanning");
      toast.error("Camera permission denied");
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

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result && typeof result === 'string') {
            setUploadedImage(result);
            scanImageForBarcode(result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  // Scan image for barcodes using Quagga2
  const scanImageForBarcode = async (imageDataUrl: string) => {
    
    setIsLoading(true);
    try {
      // Import Quagga2 dynamically
      const Quagga = await import('@ericblade/quagga2');
      
      return new Promise((resolve, reject) => {
        Quagga.default.decodeSingle({
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_93_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader"
            ]
          },
          locate: true,
          src: imageDataUrl
        }, async (result) => {
          if (result && result.codeResult) {
            const barcode = result.codeResult.code;
            toast.success(`Barcode found: ${barcode}`);
            
            // Fetch product information using the detected barcode
            try {
              const productData = await openFoodFactsService.getProductByBarcode(barcode);
              if (productData.status === 1 && productData.product) {
                setScannedProduct(productData.product);
                toast.success("Product found!");
              } else {
                setError("Product not found in Open Food Facts database");
                toast.error("Product not found");
              }
            } catch (error) {
              console.error('Error fetching product:', error);
              setError("Failed to fetch product information");
              toast.error("Failed to fetch product information");
            }
            resolve(result);
          } else {
            setError("No barcode detected in image");
            toast.error("No barcode detected in image");
            reject(new Error("No barcode detected"));
          }
          setIsLoading(false);
        });
      });
    } catch (error) {
      console.error('Error scanning image:', error);
      setError("Error scanning image");
      toast.error("Error scanning image");
      setIsLoading(false);
      throw error;
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
        <p>Scan a product barcode to get information from Open Food Facts</p>
      </div>

      {/* Tab Navigation */}
      <div className={Styles.tabNavigation}>
        <button 
          className={`${Styles.tabButton} ${activeTab === 'camera' ? Styles.activeTab : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          <Camera size={20} />
          Camera Scanner
        </button>
        <button 
          className={`${Styles.tabButton} ${activeTab === 'upload' ? Styles.activeTab : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <Upload size={20} />
          Upload Image
        </button>
      </div>

      {error && (
        <div className={Styles.errorMessage}>
          <p>{error}</p>
          <button onClick={handleTryAgain} className={Styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {isLoading && (
        <div className={Styles.loading}>
          <div className={Styles.spinner}></div>
          <p>Processing...</p>
        </div>
      )}

      {/* Camera Tab */}
      {activeTab === 'camera' && (
        <>
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
        </>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && !isLoading && !error && (
        <div className={Styles.uploadSection}>
          <div className={Styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className={Styles.fileInput}
              id="barcode-file-input"
            />
            <label htmlFor="barcode-file-input" className={Styles.uploadLabel}>
              <Upload size={48} />
              <h3>Upload Image</h3>
              <p>Select an image containing a barcode</p>
              <span className={Styles.uploadButton}>Choose File</span>
            </label>
          </div>
          
          {uploadedImage && (
            <div className={Styles.uploadedImageSection}>
              <h3>Uploaded Image</h3>
              <img src={uploadedImage} alt="Uploaded" className={Styles.uploadedImage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
