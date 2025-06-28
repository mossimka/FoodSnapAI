'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { handleGoogleSignIn } from '@/services/authService';

export const GoogleLoginButton = () => {
  const router = useRouter();

  const handleGoogleLogin = async (credential: string) => {
    try {
      await handleGoogleSignIn(credential);
      router.push('/');
    } catch (err) {
      console.error('Google auth failed:', err);
    }
  };
  return (
    <GoogleLogin
      locale="en"
      text="signin_with"
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
