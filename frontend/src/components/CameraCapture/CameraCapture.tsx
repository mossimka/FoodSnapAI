"use client";

import React, { useRef, useState } from "react";

const CameraCapture = ({ setImage }) => {
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
    const ctx = canvasRef.current.getContext("2d");
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    ctx?.drawImage(videoRef.current, 0, 0, width, height);
    videoRef.current.srcObject?.getTracks().forEach(track => track.stop());

    canvasRef.current.toBlob(blob => {
      if (blob) {
        const file = new File([blob], "snapshot.jpg", { type: "image/jpeg" });
        setImage(file);
      }
    }, "image/jpeg");

    setCapturing(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {!capturing ? (
        <button onClick={startCamera}>📷 Открыть камеру</button>
      ) : (
        <>
          <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />
          <br />
          <button onClick={capturePhoto} style={{ marginTop: "1rem" }}>
            📸 Сделать снимок
          </button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
