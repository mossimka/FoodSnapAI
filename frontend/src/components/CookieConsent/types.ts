export interface CookiePreferences {
  analytics: boolean;
}

export interface CookieConsentData {
  timestamp: string;
  preferences: CookiePreferences;
}

export interface CookieConsentProps {
  onAccept?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
} 