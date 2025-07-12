"use client";

import React, { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';
import { CookiePreferences, CookieConsentProps } from './types';

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    const preferences: CookiePreferences = { analytics: true };
    saveCookiePreferences(preferences);
    onAccept?.(preferences);
    setIsVisible(false);
  };

  const handleDecline = () => {
    const preferences: CookiePreferences = { analytics: false };
    saveCookiePreferences(preferences);
    onDecline?.();
    setIsVisible(false);
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: prefs,
    }));
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>🍪 Cookies & Analytics</h3>
        </div>
        
        <div className={styles.content}>
          <p>
            We use cookies for basic functionality and analytics to improve our website. 
            Your data helps us understand how to make the site better.
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Accept & Enable Analytics
          </button>
          <button onClick={handleDecline} className={styles.declineButton}>
            Decline Analytics
          </button>
        </div>
      </div>
    </div>
  );
} 