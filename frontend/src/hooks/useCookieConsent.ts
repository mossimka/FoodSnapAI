"use client";

import { useState, useEffect } from 'react';
import { CookiePreferences, CookieConsentData } from '../components/CookieConsent/types';

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [canUseAnalytics, setCanUseAnalytics] = useState(false);

  useEffect(() => {
    const consentData = getCookieConsent();
    if (consentData) {
      setHasConsent(true);
      setCanUseAnalytics(consentData.preferences.analytics);
    } else {
      setHasConsent(false);
      setCanUseAnalytics(false);
    }
  }, []);

  const getCookieConsent = (): CookieConsentData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem('cookie-consent');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const updateCookieConsent = (preferences: CookiePreferences) => {
    const consentData: CookieConsentData = {
      timestamp: new Date().toISOString(),
      preferences,
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    setHasConsent(true);
    setCanUseAnalytics(preferences.analytics);
  };

  const refreshConsent = () => {
    localStorage.removeItem('cookie-consent');
    setHasConsent(false);
    setCanUseAnalytics(false);
    window.location.reload();
  };

  return {
    hasConsent,
    canUseAnalytics,
    updateCookieConsent,
    refreshConsent,
  };
} 