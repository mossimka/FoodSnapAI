import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Shield, ShieldCheck, AlertCircle } from "lucide-react";
import ReCAPTCHA from 'react-google-recaptcha';

import Styles from "./CaptchaModal.module.css";

interface CaptchaModalProps {
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    setError(null);
    
    if (token) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        onSuccess(token);
      }, 800);
    }
  };

  const handleCaptchaError = () => {
    setError("CAPTCHA verification failed. Please try again.");
    setCaptchaToken(null);
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }
    onSuccess(captchaToken);
  };

  const popup = (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>
          <div className={Styles.titleSection}>
            <Shield className={Styles.titleIcon} />
            <h2 className={Styles.title}>Security Verification</h2>
          </div>
          <button className={Styles.close} onClick={onClose}>
            <X />
          </button>
        </div>

        <div className={Styles.content}>
          <p className={Styles.message}>
            Please complete the security verification to continue with your registration.
          </p>

          <div className={Styles.captchaContainer}>
            {isLoading && (
              <div className={Styles.loadingState}>
                <div className={Styles.spinner}></div>
                <span>Verifying...</span>
              </div>
            )}

            {!isLoading && !captchaToken && (
              <div className={Styles.recaptchaWrapper}>
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleCaptchaChange}
                  onErrored={handleCaptchaError}
                  theme="light"
                />
              </div>
            )}

            {captchaToken && !isLoading && (
              <div className={Styles.successState}>
                <ShieldCheck className={Styles.successIcon} />
                <span>Verification successful!</span>
              </div>
            )}

            {error && (
              <div className={Styles.errorState}>
                <AlertCircle className={Styles.errorIcon} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className={Styles.actions}>
            <button
              className={`${Styles.button} ${Styles.buttonSecondary}`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`${Styles.button} ${Styles.buttonPrimary}`}
              onClick={handleSubmit}
              disabled={!captchaToken || isLoading}
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(popup, document.body)
    : null;
}; 