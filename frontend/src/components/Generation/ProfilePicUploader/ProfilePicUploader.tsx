'use client';

import React, { useState, useCallback } from 'react';
import Image from "next/image";
import { useDropzone } from 'react-dropzone';
import { uploadProfilePic } from '@/services/profileService';
import { useUserStore } from '@/stores/userStore';
import Style from './ProfilePicUploader.module.css';

const ProfilePicUploader = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file || !user) return;

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      try {
        setLoading(true);
        const imageUrl = await uploadProfilePic(file);
        setUser({ ...user, profile_pic: imageUrl });
      } catch (err: unknown) {
        alert('Upload failed: ' + err);
      } finally {
        setLoading(false);
      }
    },
    [user, setUser]
  );

  const { getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className={Style.avatarWrapper}>
      <input {...getInputProps()} />
      <div
        className={Style.avatarClickable}
        onClick={open}
        title="Click to change profile picture"
      >
        <Image
          src={user?.profile_pic || previewUrl || '/images/user.png'}
          alt="Profile"
          width={120}
          height={120}
          className={Style.avatarImage}
        />

        {loading && <div className={Style.loaderOverlay}>Uploading...</div>}
      </div>
      <p className={Style.uploadText}>Click to upload new</p>
    </div>
  );
};

export default ProfilePicUploader;
