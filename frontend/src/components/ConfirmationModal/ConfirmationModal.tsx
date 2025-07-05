import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Styles from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const popup = (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>
          <h2 className={Styles.title}>{title}</h2>
          <button 
            className={Styles.closeButton} 
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={Styles.content}>
          <p className={Styles.message}>{message}</p>
        </div>
        
        <div className={Styles.actions}>
          <button 
            className="button" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className="buttonRed" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
  ? createPortal(popup, document.body)
  : null;
}; 