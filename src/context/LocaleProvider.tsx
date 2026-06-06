import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getTranslations,
  LocaleContext,
  loadLocale,
  saveLocale,
  type LocaleContextValue,
} from '../i18n';
import type { Locale } from '../i18n/types';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: getTranslations(locale),
      setLocale,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
