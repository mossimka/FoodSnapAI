"use client"; 

import React, { createContext, useState, useEffect, useContext, ReactNode  } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>('light');
  
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }, []);
  
    useEffect(() => {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
      localStorage.setItem('theme', theme);
      
      const updateScrollbar = () => {
        const scrollbarColors = {
          light: '#ff914d rgb(248, 243, 236)',
          dark: '#ff914d #1f1f1f'
        };
        
        document.documentElement.style.scrollbarColor = '';
        
        setTimeout(() => {
          document.documentElement.style.scrollbarColor = scrollbarColors[theme];
        }, 10);
      };
      
      updateScrollbar();
    }, [theme]);
  
    const toggleTheme = () => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
