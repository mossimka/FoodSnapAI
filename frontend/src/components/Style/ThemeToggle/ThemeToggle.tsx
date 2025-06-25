import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useState } from 'react';

const styles = {
  toggleButton: {
    background: 'var(--border-color)',
    color: 'var(--bg-color)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: 'var(--box-shadow)',
    transition: 'all 0.3s ease-in-out',
    fontSize: '1.2rem',
  },
  toggleButtonHover: {
     boxShadow: 'var(--box-shadow-inset)',
  }
};


export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);


  return (
    <button
      onClick={toggleTheme}
      style={{
        ...styles.toggleButton,
        ...(isHovered ? styles.toggleButtonHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
};
