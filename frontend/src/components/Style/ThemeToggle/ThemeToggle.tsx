import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import Styles from './ThemeToggle.module.css';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={Styles.toggleButton}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
};
