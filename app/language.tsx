'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { translateContent } from '../i18n/content';
import { messages, timeZone } from '../i18n/messages';
import {
  createLocalLanguageStore,
  defaultLanguage,
  initialLanguage,
  type AppLanguage,
  type LanguagePreferenceStore,
} from './language-model';

type LanguageContextValue = {
  language: AppLanguage;
  /** Shows the app in `language` and saves it as the user's preference. */
  setLanguage: (language: AppLanguage) => void;
  /** False until the saved or browser language has been applied after mount. */
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Owns the display language for app/(learner). The server and the first
 * client render use the default language; the saved preference (or the
 * browser's language on a first visit) is applied after mount, so the HTML
 * always matches (app/CLAUDE.md, non-negotiable 1). Only an explicit choice is
 * saved.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(defaultLanguage);
  const [ready, setReady] = useState(false);
  const storeRef = useRef<LanguagePreferenceStore | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const store = createLocalLanguageStore(browserStorage());
      storeRef.current = store;
      setLanguageState(initialLanguage(store.load(), navigator.languages ?? []));
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
    (storeRef.current ??= createLocalLanguageStore(browserStorage())).save(next);
  }, []);

  const value = useMemo(() => ({ language, setLanguage, ready }), [language, setLanguage, ready]);

  return (
    <LanguageContext.Provider value={value}>
      <NextIntlClientProvider locale={language} messages={messages[language]} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

/**
 * Translates content strings (data written in English in app/learner-app.tsx)
 * into the current language. Interface copy uses useTranslations instead.
 */
export function useContent(): (text: string) => string {
  const { language } = useLanguage();
  return useCallback((text: string) => translateContent(text, language), [language]);
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage() must be used inside <LanguageProvider>.');
  return value;
}
