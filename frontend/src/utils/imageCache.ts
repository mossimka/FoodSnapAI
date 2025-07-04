interface CachedImage {
  data: string; // base64 encoded image
  filename: string;
  type: string;
  size: number;
  timestamp: number;
  compressed: boolean;
}

const CACHE_KEY = 'foodsnap_cached_image';
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours
const MAX_CACHE_SIZE = 4 * 1024 * 1024; // 4MB limit for localStorage

/**
 * Convert File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/[type];base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convert base64 string back to File
 */
const base64ToFile = (base64: string, filename: string, type: string): File => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type });
};

/**
 * Check if cached image is expired
 */
const isCacheExpired = (timestamp: number): boolean => {
  const now = Date.now();
  const expiryTime = timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
  return now > expiryTime;
};

/**
 * Get available localStorage space (rough estimate)
 */
const getAvailableSpace = (): number => {
  try {
    const storage = localStorage.getItem(CACHE_KEY);
    const used = storage ? new Blob([storage]).size : 0;
    
    // Rough estimate of available space
    return MAX_CACHE_SIZE - used;
  } catch {
    return 0;
  }
};

/**
 * Cache an image file in localStorage
 */
export const cacheImage = async (file: File): Promise<boolean> => {
  try {
    // Check if we have enough space (rough estimate)
    const estimatedSize = file.size * 1.4; // base64 is ~33% larger, plus metadata
    const availableSpace = getAvailableSpace();
    
    if (estimatedSize > availableSpace) {
      console.warn('Not enough space to cache image');
      return false;
    }
    
    const base64Data = await fileToBase64(file);
    
    const cachedImage: CachedImage = {
      data: base64Data,
      filename: file.name,
      type: file.type,
      size: file.size,
      timestamp: Date.now(),
      compressed: true // Assuming the file is already compressed
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedImage));
    console.log('Image cached successfully:', file.name);
    return true;
    
  } catch (error) {
    console.error('Failed to cache image:', error);
    return false;
  }
};

/**
 * Retrieve cached image from localStorage
 */
export const getCachedImage = (): { file: File; previewUrl: string } | null => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;
    
    const cachedImage: CachedImage = JSON.parse(cachedData);
    
    // Check if cache is expired
    if (isCacheExpired(cachedImage.timestamp)) {
      clearImageCache();
      return null;
    }
    
    // Convert back to File
    const file = base64ToFile(cachedImage.data, cachedImage.filename, cachedImage.type);
    const previewUrl = URL.createObjectURL(file);
    
    console.log('Retrieved cached image:', cachedImage.filename);
    return { file, previewUrl };
    
  } catch (error) {
    console.error('Failed to retrieve cached image:', error);
    clearImageCache(); // Clear corrupted cache
    return null;
  }
};

/**
 * Clear cached image from localStorage
 */
export const clearImageCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('Image cache cleared');
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
};

/**
 * Check if there's a cached image
 */
export const hasCachedImage = (): boolean => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return false;
    
    const cachedImage: CachedImage = JSON.parse(cachedData);
    return !isCacheExpired(cachedImage.timestamp);
    
  } catch {
    return false;
  }
};

/**
 * Get cached image metadata without loading the full file
 */
export const getCachedImageInfo = (): Pick<CachedImage, 'filename' | 'size' | 'type' | 'timestamp'> | null => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;
    
    const cachedImage: CachedImage = JSON.parse(cachedData);
    
    if (isCacheExpired(cachedImage.timestamp)) {
      clearImageCache();
      return null;
    }
    
    return {
      filename: cachedImage.filename,
      size: cachedImage.size,
      type: cachedImage.type,
      timestamp: cachedImage.timestamp
    };
    
  } catch {
    return null;
  }
}; 