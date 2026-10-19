import { createContext, useContext } from 'react';
import { en, es } from './locales';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type Locale } from './types';
import type { Translations } from './locales';

const locales: Record<Locale, Translations> = { es, en };

export function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* Quota or private mode should not interrupt the language toggle. */
  }
}

export function getTranslations(locale: Locale): Translations {
  return locales[locale];
}

export interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

export function translateAction(locale: Locale, action: keyof Translations['actions']): string {
  return locales[locale].actions[action];
}

export function translateBetting(locale: Locale, suggestion: keyof Translations['betting']): string {
  return locales[locale].betting[suggestion];
}
