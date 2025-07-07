"use client";

import React, { useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import { Barcode } from "./Barcode";
import Styles from "./BarcodeButton.module.css";

export const BarcodeButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Block scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={handleToggle}
        className={Styles.barcodeButton}
        title="Scan Barcode"
        aria-label="Open barcode scanner"
      >
        <QrCode size={24} />
      </button>

      {isOpen && (
        <div className={Styles.modal}>
          <div className={Styles.modalContent}>
            <button 
              onClick={handleClose}
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