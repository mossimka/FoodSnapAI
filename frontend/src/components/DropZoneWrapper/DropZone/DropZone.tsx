"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload } from 'lucide-react';

import Style from './DropZone.module.css';


const DropZone = ({ setImage }) => {
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const previewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrl);
    setImage(file);
  }, [setImage]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 5000000, // 5MB
  });

  return (
    <div className={Style.dropZone}>
      <div className={Style.dropZoneBox} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={Style.dropZoneInput}>
          <p>Upload your dish photo</p>
          <div className={Style.dropZoneImageWrapper}>
            <Upload
              className={Style.dropZoneImage}
            />
          </div>
          <p className="gradientText2">Drag & drop or click to select an image</p>
          <p>Supported: .jpg, .jpeg, .png (Max: 5MB)</p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
