'use client';

import { useEffect, useState } from 'react';
import { tokenService } from '@/services/tokenService';

interface AuthInitializerProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function AuthInitializer({ children, loadingComponent }: AuthInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await tokenService.initializeAuth();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  if (!isInitialized) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
} 