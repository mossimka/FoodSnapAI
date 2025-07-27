"use client";

import React, { useEffect, useState } from "react";
import Styles from "./Printer.module.css";

interface PrinterProps {
  initialText?: string;
  typeSpeed?: number;
  fontSize?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
  textShadow?: 'glow' | 'neonPulse' | 'neonFlicker' | 'softGlow' | 'colored';
  brightness?: 'normal' | 'lighter' | 'light' | 'very-light';
  onComplete?: () => void;
}

export const Printer: React.FC<PrinterProps> = ({
  initialText = "Hello, World!",
  typeSpeed = 50,
  fontSize = "1rem",
  fontFamily = "inherit",
  textAlign = "left",
  className = "",
  style = {},
  textShadow,
  onComplete
}) => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < initialText.length) {
        setText(initialText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, typeSpeed);

    return () => clearInterval(timer);
  }, [initialText, typeSpeed, onComplete]);

  // Определяем CSS класс для тени
  const getShadowClass = () => {
    if (!textShadow) return '';
    
    switch (textShadow) {
      case 'softGlow': return Styles.softGlow;
      case 'glow': return Styles.glowShadow;
      case 'neonPulse': return Styles.neonPulse;
      case 'neonFlicker': return Styles.neonFlicker;
      case 'colored': return Styles.coloredShadow;
      default: return Styles.withShadow;
    }
  };

  // Определяем inline стиль для кастомной тени
  const getCustomShadow = () => {
    if (!textShadow || ['softGlow', 'glow', 'neonPulse', 'neonFlicker', 'colored'].includes(textShadow)) {
      return {};
    }
    return { textShadow };
  };

  return (
    <span
      className={`
        ${Styles.responseText} 
        ${!isTyping ? Styles.done : ''} 
        ${getShadowClass()}
        ${className}
      `.trim()}
      style={{
        fontSize,
        fontFamily,
        textAlign,
        ...getCustomShadow(),
        ...style
      }}
    >
      {text}
    </span>
  );
};
