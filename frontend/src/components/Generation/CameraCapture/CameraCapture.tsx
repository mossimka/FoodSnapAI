"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { Camera, Clipboard } from "lucide-react";
import Styles from "./CameraCapture.module.css";

interface DropZoneProps {
  setImage: (file: File) => void;
}

const CameraCapture: React.FC<DropZoneProps> = ({ setImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [justPasted, setJustPasted] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setTimeout(() => setVisible(true), 10);
    return () => setVisible(false);
  }, []);

  const handleClipboardImage = useCallback((file: File) => {
    // Валидация размера
    if (file.size > 10 * 1024 * 1024) {
      setPasteError('Image too large (max 10MB)');
      setTimeout(() => setPasteError(null), 3000);
      return;
    }

    // Валидация типа
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      setPasteError('Unsupported format. Use PNG, JPG, or JPEG');
      setTimeout(() => setPasteError(null), 3000);
      return;
    }

    // Успешная вставка
    setPasteError(null);
    setJustPasted(true);
    setTimeout(() => setJustPasted(false), 1000);
    
    setImage(file);
  }, [setImage]);

  // Обработка paste события
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            handleClipboardImage(file);
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handleClipboardImage]);

  const startCamera = async () => {
    setCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext("2d");

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    ctx?.drawImage(videoRef.current, 0, 0, width, height);

    (videoRef.current.srcObject as MediaStream)?.getTracks().forEach(track => track.stop());

    canvasRef.current.toBlob(blob => {
      if (blob) {
        const randomId = Math.random().toString(36).substring(2, 10);
        const randomName = `photo_${randomId}.jpg`;
        const file = new File([blob], randomName, { type: "image/jpeg" });
        setImage(file);
      }
    }, "image/jpeg");

    setCapturing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPasteError(null); // Очищаем ошибки при обычной загрузке
      setImage(file);
    }
  };

  return (
    <>
      <div
        className={`${Styles.cameraContainer} ${
          visible ? Styles.cameraContainerVisible : Styles.cameraContainerHidden
        } ${justPasted ? Styles.justPasted : ''}`}
      >
        <div className={Styles.cameraContent}>
          <div className={Styles.cameraIconWrapper}>
            <Camera className={Styles.cameraIcon} />
          </div>
          
          <p className={Styles.cameraTitle}>Take a photo</p>
          
          <div className={Styles.buttonContainer}>
            {isMobile ? (
              <>
                <label htmlFor="cameraInput" className={Styles.fakeButton}>
                  Open Camera
                </label>
                <input
                  id="cameraInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </>
            ) : (
              <button onClick={startCamera} className="button">
                Open Camera
              </button>
            )}
          </div>

          {/* Подсказка про Ctrl+V */}
          <div className={Styles.pasteHint}>
            <div className={Styles.pasteHintContent}>
              <Clipboard className={Styles.pasteIcon} />
              <span className={Styles.pasteText}>
                or press <kbd className={Styles.kbd}>Ctrl</kbd> + <kbd className={Styles.kbd}>V</kbd> to paste
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Уведомления об ошибках */}
      {pasteError && (
        <div className={Styles.pasteError}>
          <span>❌ {pasteError}</span>
        </div>
      )}
      
      {/* Индикатор успешной вставки */}
      {justPasted && (
        <div className={Styles.pasteSuccess}>
          <span>✅ Image pasted successfully!</span>
        </div>
      )}

      {capturing &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div className={Styles.cameraWrapper}>
            <video
              ref={videoRef}
              className={Styles.cameraVideo}
              playsInline
              autoPlay
              muted
            />
            <div className={Styles.overlay}>
              <div className={Styles.mask}></div>
            </div>
            <button className={Styles.captureButton} onClick={capturePhoto}></button>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>,
          document.body
        )}
    </>
  );
};

export default CameraCapture;
