import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService.js';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuth();
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    if (user && user.theme) {
      setTheme(user.theme);
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (user) {
      try {
        await authService.updateProfile({ theme: newTheme });
        updateUser({ theme: newTheme });
      } catch (err) {
        console.error('Failed to sync theme:', err);
      }
    }
  }, [theme, user, updateUser]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
