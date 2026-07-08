import React, { createContext, useContext, useState, useCallback } from 'react';
import type { HomeLanguage } from '../../lang/HomeLang';
import { homeTexts } from '../../lang/HomeLang';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  texts: ReturnType<typeof getLangTexts>;
}

function getLangTexts(lang: string) {
  return homeTexts[lang as HomeLanguage] ?? homeTexts['English'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: string }> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<string>(initialLanguage || 'English');

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
  }, []);

  const texts = getLangTexts(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, texts }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};