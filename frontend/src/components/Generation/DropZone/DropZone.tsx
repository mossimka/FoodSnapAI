'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Clipboard } from 'lucide-react';
import Style from './DropZone.module.css';

interface DropZoneProps {
  setImage: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ setImage }) => {
  const [, setFilePreviewUrl] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [justPasted, setJustPasted] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    return () => setVisible(false);
  }, []);

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
  }, []);

  const handleClipboardImage = (file: File) => {
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
    
    const previewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrl);
    setImage(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setPasteError(null); // Очищаем ошибки при обычной загрузке
    const previewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrl);
    setImage(file);
  }, [setImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      className={`${Style.dropZone} ${
        visible ? Style.dropZoneVisible : Style.dropZoneHidden
      } ${justPasted ? Style.justPasted : ''}`}
    >
      <div 
        className={`${Style.dropZoneBox} ${isDragActive ? Style.dropZoneActive : ''}`} 
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className={Style.dropZoneInput}>
          <p>Upload your dish photo</p>
          <div className={Style.dropZoneImageWrapper}>
            <Upload className={Style.dropZoneImage} />
          </div>
          <p className="gradientText2">Drag & drop or click to select an image</p>
          
          {/* Подсказка про Ctrl+V */}
          <div className={Style.pasteHint}>
            <div className={Style.pasteHintContent}>
              <Clipboard className={Style.pasteIcon} />
              <span className={Style.pasteText}>
                or press <kbd className={Style.kbd}>Ctrl</kbd> + <kbd className={Style.kbd}>V</kbd> to paste
              </span>
            </div>
          </div>
          
          <p>Supported: .jpg, .jpeg, .png (Max: 10MB)</p>
        </div>
      </div>
      
      {/* Уведомления об ошибках */}
      {pasteError && (
        <div className={Style.pasteError}>
          <span>❌ {pasteError}</span>
        </div>
      )}
      
      {/* Индикатор успешной вставки */}
      {justPasted && (
        <div className={Style.pasteSuccess}>
          <span>✅ Image pasted successfully!</span>
        </div>
      )}
    </div>
  );
};

export default DropZone;
