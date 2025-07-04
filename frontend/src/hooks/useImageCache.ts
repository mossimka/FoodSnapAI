import { useState, useEffect } from 'react';
import { 
  cacheImage, 
  getCachedImage, 
  clearImageCache, 
  hasCachedImage,
  getCachedImageInfo 
} from '@/utils/imageCache';

interface UseImageCacheReturn {
  // Cache state
  hasCachedImage: boolean;
  cachedImageInfo: ReturnType<typeof getCachedImageInfo>;
  
  // Cache operations
  cacheImage: (file: File) => Promise<boolean>;
  loadCachedImage: () => { file: File; previewUrl: string } | null;
  clearCache: () => void;
  
  // Cache metadata
  getCacheSize: () => number;
  getCacheAge: () => number | null; // in hours
}

export const useImageCache = (): UseImageCacheReturn => {
  const [hasCached, setHasCached] = useState(false);
  const [cachedInfo, setCachedInfo] = useState<ReturnType<typeof getCachedImageInfo>>(null);

  // Check cache status on mount and update state
  useEffect(() => {
    const checkCache = () => {
      const hasCache = hasCachedImage();
      const info = getCachedImageInfo();
      
      setHasCached(hasCache);
      setCachedInfo(info);
    };

    checkCache();
    
    // Listen for localStorage changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'foodsnap_cached_image') {
        checkCache();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCacheImage = async (file: File): Promise<boolean> => {
    const success = await cacheImage(file);
    if (success) {
      setHasCached(true);
      setCachedInfo(getCachedImageInfo());
    }
    return success;
  };

  const loadCachedImage = () => {
    const cached = getCachedImage();
    if (cached) {
      setHasCached(true);
      setCachedInfo(getCachedImageInfo());
    }
    return cached;
  };

  const clearCache = () => {
    clearImageCache();
    setHasCached(false);
    setCachedInfo(null);
  };

  const getCacheSize = (): number => {
    if (!cachedInfo) return 0;
    return cachedInfo.size;
  };

  const getCacheAge = (): number | null => {
    if (!cachedInfo) return null;
    const now = Date.now();
    const ageMs = now - cachedInfo.timestamp;
    return ageMs / (1000 * 60 * 60); // Convert to hours
  };

  return {
    hasCachedImage: hasCached,
    cachedImageInfo: cachedInfo,
    cacheImage: handleCacheImage,
    loadCachedImage,
    clearCache,
    getCacheSize,
    getCacheAge
  };
}; 