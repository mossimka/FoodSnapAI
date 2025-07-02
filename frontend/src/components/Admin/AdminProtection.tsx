'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/lib/axios';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      // Проверяем авторизацию
      if (!isAuthenticated || !token) {
        console.log('No auth token, redirecting to signin');
        router.push('/signin');
        return;
      }

      console.log('Checking admin access with token:', token);

      // Проверяем доступ к админской панели
      const response = await axios.get('/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Admin dashboard response:', response.status);
      setIsAdmin(true);
      
    } catch (error: unknown) {
      console.error('Error checking admin access:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 403) {
          console.log('Access denied - not admin');
          setIsAdmin(false);
        } else if (axiosError.response?.status === 401) {
          console.log('Unauthorized - redirecting to signin');
          router.push('/signin');
          return;
        } else {
          console.log('Other error:', axiosError.response?.status);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#4ecdc4',
        fontSize: '1.5rem',
        fontFamily: 'Monaco, monospace'
      }}>
        Checking admin access...
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#e74c3c',
        fontFamily: 'Monaco, monospace',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🚫</h1>
        <h2 style={{ marginBottom: '10px' }}>Access Denied</h2>
        <p style={{ marginBottom: '30px', color: '#888' }}>
          You need admin privileges to access this page.
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4ecdc4',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 