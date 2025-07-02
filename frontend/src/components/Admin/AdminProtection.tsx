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
        background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--bg-color2) 100%)',
        color: 'var(--color1)',
        fontSize: '1.5rem',
        fontFamily: 'Rubik, Monaco, monospace',
        fontWeight: '600'
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
        background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--bg-color2) 100%)',
        color: 'var(--text-color)',
        fontFamily: 'Rubik, Monaco, monospace',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '20px',
          background: 'var(--gradientRed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>🚫</h1>
        <h2 style={{ 
          marginBottom: '10px',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '700'
        }}>Access Denied</h2>
        <p style={{ 
          marginBottom: '30px', 
          color: 'var(--text-color-sub)',
          fontSize: '1.1rem'
        }}>
          You need admin privileges to access this page.
        </p>
        <button
          onClick={() => router.push('/')}
          className="button"
          style={{
            fontSize: '16px'
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 