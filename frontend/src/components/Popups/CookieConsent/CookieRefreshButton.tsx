"use client";

import React from 'react';
import { useCookieConsent } from '../../hooks/useCookieConsent';

interface CookieRefreshButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export default function CookieRefreshButton({ 
  children = 'Reset Cookie Preferences', 
  className = '' 
}: CookieRefreshButtonProps) {
  const { refreshConsent } = useCookieConsent();

  return (
    <button onClick={refreshConsent} className={className}>
      {children}
    </button>
  );
} 