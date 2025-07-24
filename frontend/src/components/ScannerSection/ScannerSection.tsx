"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Scan, Package, Info } from "lucide-react";
import { Barcode } from "../Barcode/Barcode";
import Styles from "./ScannerSection.module.css";

export const ScannerSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenScanner = () => {
    setIsModalOpen(true);
  };

  const handleCloseScanner = () => {
    setIsModalOpen(false);
  };

  // Block scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <section className={Styles.scannerSection}>
        <div className={Styles.container}>
          <div className={Styles.header}>
            <div className={Styles.iconContainer}>
              <QrCode className={Styles.mainIcon} size={48} />
              <Scan className={Styles.accentIcon} size={24} />
            </div>
            <h2 className={Styles.title}>
              <span className="gradientText">Barcode Scanner</span>
            </h2>
            <p className={Styles.description}>
              Scan product barcodes to get detailed nutritional information, ingredients, and product details
            </p>
          </div>

          <div className={Styles.content}>
            <div className={Styles.features}>
              <div className={Styles.feature}>
                <Package className={Styles.featureIcon} size={24} />
                <div className={Styles.featureText}>
                  <h3>Product Information</h3>
                  <p>Get detailed product data including ingredients, nutritional facts, and brand information</p>
                </div>
              </div>
              <div className={Styles.feature}>
                <Info className={Styles.featureIcon} size={24} />
                <div className={Styles.featureText}>
                  <h3>Nutrition Analysis</h3>
                  <p>View Nutri-Score ratings, eco-scores, and comprehensive nutritional breakdown</p>
                </div>
              </div>
            </div>

            <div className={Styles.actionContainer}>
              <button 
                onClick={handleOpenScanner}
                className={Styles.scanButton}
                aria-label="Open barcode scanner"
              >
                <QrCode size={24} />
                <span>Scan Barcode</span>
              </button>
              <p className={Styles.hint}>
                Point your camera at any product barcode or upload a barcode image
              </p>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className={Styles.modal}>
          <div className={Styles.modalContent}>
            <button 
              onClick={handleCloseScanner}
              className={Styles.modalClose}
              aria-label="Close barcode scanner"
            >
              ×
            </button>
            <Barcode />
          </div>
        </div>
      )}
    </>
  );
}; 