'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export const GoogleProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};
