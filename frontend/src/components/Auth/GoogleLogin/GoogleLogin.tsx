'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const GoogleLoginButton = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  const handleGoogleLogin = async (credential: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/google`, {
        token: credential,
      });

      const accessToken = res.data.access_token;
      login(accessToken);
      router.push('/');
    } catch (err) {
      console.error('Google auth failed:', err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const credential = credentialResponse.credential;
        if (!credential) {
          console.error('Missing Google credential');
          return;
        }

        handleGoogleLogin(credential);
      }}
      onError={() => {
        console.log('Google Login Failed');
      }}
    />
  );
};
