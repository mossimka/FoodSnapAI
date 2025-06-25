"use client";

import React, { useEffect, useState } from "react";
import styles from "./Printer.module.css";

interface PrinterProps {
  initialText: string;
  className?: string;
  fontSize?: string;
  textAlign?: React.CSSProperties['textAlign'];
}

export const Printer: React.FC<PrinterProps> = ({ initialText, className, fontSize, textAlign }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + initialText[index]);
      index++;

      if (index >= initialText.length - 1) {
        clearInterval(interval);
        setDone(true);
        setDisplayedText(initialText);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [initialText]);

  return (
    <span
      className={`${styles.responseText} ${done ? styles.done : ""} ${className || ""}`}
      style={{
        fontSize,
        textAlign,
      }}
    >
      {displayedText}
    </span>
  );
};
