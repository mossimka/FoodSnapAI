"use client";

import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom"; // ← Добавь это
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


  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setTimeout(() => setVisible(true), 10);
    return () => setVisible(false);
  }, []);
  

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
      setImage(file);
    }
  };

  return (
    <>
      <div
        className={
          `${Styles.cameraContainer} ` +
          (visible ? Styles.cameraContainerVisible : Styles.cameraContainerHidden)
        }
      >
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
          <button onClick={startCamera} className={Styles.fakeButton}>
            Open Camera
          </button>
        )}
        </div>
      </div>

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
