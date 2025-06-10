// components/DropZone/DropZoneWrapper.tsx
"use client";

import React, { useState } from "react";
import DropZone from "./DropZone";
import CameraCapture from "../CameraCapture/CameraCapture";

import Styles from "./DropZoneWrapped.module.css";

export const DropZoneWrapper = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    console.log("Chosen file:", file);
  };

  return (
    <div className={Styles.wrapper}>
      <DropZone setImage={handleImageSelect} />
      {imageFile && <p className="gradientText">You chose file: {imageFile.name}</p>}
      <CameraCapture setImage={handleImageSelect} />
    </div>
  );
};
