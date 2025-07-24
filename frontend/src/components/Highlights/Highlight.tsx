import React from 'react';
import styles from './Highlight.module.css';

interface HighlightProps {
  text: React.ReactNode;
  left: number;
  top: number;
  angle: number;
  fontWeight?: number;
  fontSize?: string;
  className?: string;
}

const Highlight: React.FC<HighlightProps> = ({
  text,
  left,
  top,
  angle,
  fontWeight = 400,
  fontSize = '1rem',
  className = ''
}) => {
  return (
    <div
      className={`${styles.highlight} ${className}`}
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        fontWeight,
        fontSize,
        transformOrigin: 'center',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 10,
        '--base-rotation': `${angle}deg`
      } as React.CSSProperties}
    >
      {text}
    </div>
  );
};

export default Highlight;
