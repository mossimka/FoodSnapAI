import React, { useEffect, useState } from 'react';
import Styles from "./Printer.module.css";

interface PrinterProps {
  initialText: string;
  className?: string;
}

export const Printer: React.FC<PrinterProps> = ({ initialText, className }) => {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < initialText.length) {
        setTypedText((prev) => prev + initialText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [initialText]);

  return (
    <pre className={`${Styles.responseText} ${className ?? ''}`}>
      {typedText}
    </pre>
  );
};
