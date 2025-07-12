"use client";

import React from 'react';
import CookieConsent from './CookieConsent';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookiePreferences } from './types';

interface CookieWrapperProps {
  children: React.ReactNode;
}

export default function CookieWrapper({ children }: CookieWrapperProps) {
  const { hasConsent, updateCookieConsent } = useCookieConsent();

  const handleAccept = (preferences: CookiePreferences) => {
    updateCookieConsent(preferences);
    if (preferences.analytics) {
      console.log('Analytics enabled');
    }
  };

  const handleDecline = () => {
    console.log('Analytics declined');
  };

  return (
    <>
      {children}
      {hasConsent === false && (
        <CookieConsent 
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </>
  );
} 