import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeProvider';

import Styles from "./PeerlistCard.module.css";

export const PeerlistCard = () => {
  const { theme } = useTheme();
  
  const getImageSrc = () => {
    if (theme === 'dark') {
      return '/images/peerlist_black.webp';
    }
    return '/images/peerlist_light.webp';
  };

  return (
    <div className={Styles.card}>
      <Image 
        src={getImageSrc()} 
        height={200} 
        width={350} 
        className={Styles.cardImage} 
        alt='Peerlist review'
      />
    </div>
  )
}
