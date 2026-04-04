import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

type Locale = 'en' | 'hi';
type Translations = Record<string, string>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Locale, Translations> = { en, hi };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app_locale') as Locale;
    if (saved && ['en', 'hi'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('app_locale', l);
  };

  const t = (key: string): string => {
    const dict = dictionaries[locale] || dictionaries['en'];
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
