'use client';

import { useParams } from 'next/navigation';
import { SupportedLocale, TranslationKeys } from '@/types/i18n';
import { getTranslations } from '@/lib/i18n';

/**
 * Hook to get translations for the current locale
 */
export function useTranslations(): TranslationKeys {
  const params = useParams();
  const locale = (params.locale as SupportedLocale) || 'en';
  return getTranslations(locale);
}

/**
 * Hook to get the current locale
 */
export function useLocale(): SupportedLocale {
  const params = useParams();
  return (params.locale as SupportedLocale) || 'en';
}

/**
 * Hook to get translation for a specific key path
 */
export function useTranslation(): {
  t: (key: string) => string;
  locale: SupportedLocale;
  translations: TranslationKeys;
} {
  const translations = useTranslations();
  const locale = useLocale();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale, translations };
}