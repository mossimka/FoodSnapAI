"use client";

import React, { useRef, useState } from "react";

import Styles from "./CameraCapture.module.css";

interface DropZoneProps {
  setImage: (file: File) => void;
}

const CameraCapture: React.FC<DropZoneProps> = ({ setImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturing, setCapturing] = useState(false);

  const startCamera = async () => {
    setCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        const file = new File([blob], "snapshot.jpg", { type: "image/jpeg" });
        setImage(file);
      }
    }, "image/jpeg");

    setCapturing(false);
  };

  return (
    <div className={Styles.cameraContainer}>
      {!capturing ? (
        <button onClick={startCamera} className="button">Open Camera</button>
      ) : (
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
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
