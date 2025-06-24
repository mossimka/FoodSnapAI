'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import Style from './DropZone.module.css';

interface DropZoneProps {
  setImage: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ setImage }) => {
  const [, setFilePreviewUrl] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    return () => setVisible(false);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
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
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div
      className={
        `${Style.dropZone} ` +
        (visible ? Style.dropZoneVisible : Style.dropZoneHidden)
      }
    >
      <div className={Style.dropZoneBox} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={Style.dropZoneInput}>
          <p>Upload your dish photo</p>
          <div className={Style.dropZoneImageWrapper}>
            <Upload className={Style.dropZoneImage} />
          </div>
          <p className="gradientText2">Drag & drop or click to select an image</p>
          <p>Supported: .jpg, .jpeg, .png (Max: 5MB)</p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
