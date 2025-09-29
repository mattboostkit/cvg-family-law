import { SupportedLocale, TranslationKeys, RTLLocale } from '@/types/i18n';
import { translations, getTranslation, isRTLLocale } from './translations';

export type { SupportedLocale, TranslationKeys, RTLLocale };

export {
  translations,
  getTranslation,
  isRTLLocale,
};

export const locales = ['en', 'ur', 'ar', 'pl', 'hi'] as const;
export const defaultLocale: SupportedLocale = 'en';
export const rtlLocales: RTLLocale[] = ['ar', 'ur'];

/**
 * Get the translation for a specific locale
 */
export function getTranslations(locale: SupportedLocale): TranslationKeys {
  return translations[locale] || translations.en;
}

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: SupportedLocale): boolean {
  return isRTLLocale(locale);
}

/**
 * Get direction for a locale
 */
export function getDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * Get language name for a locale
 */
export function getLanguageName(locale: SupportedLocale): string {
  const languageNames: Record<SupportedLocale, string> = {
    en: 'English',
    ur: 'اردو',
    ar: 'العربية',
    pl: 'Polski',
    hi: 'हिन्दी',
  };
  return languageNames[locale] || 'English';
}

/**
 * Get native language name for a locale
 */
export function getNativeLanguageName(locale: SupportedLocale): string {
  const nativeNames: Record<SupportedLocale, string> = {
    en: 'English',
    ur: 'اردو',
    ar: 'العربية',
    pl: 'Polski',
    hi: 'हिन्दी',
  };
  return nativeNames[locale] || 'English';
}

/**
 * Detect user's preferred locale from browser headers
 */
export function detectLocale(
  acceptLanguage?: string | null,
  fallbackLocale: SupportedLocale = defaultLocale
): SupportedLocale {
  if (!acceptLanguage) return fallbackLocale;

  const languages = acceptLanguage.split(',').map(lang => {
    const [locale] = lang.trim().split(';');
    return locale.toLowerCase();
  });

  for (const lang of languages) {
    // Check for exact match
    if (locales.includes(lang as SupportedLocale)) {
      return lang as SupportedLocale;
    }

    // Check for language prefix match (e.g., 'en-US' -> 'en')
    const prefix = lang.split('-')[0];
    if (locales.includes(prefix as SupportedLocale)) {
      return prefix as SupportedLocale;
    }
  }

  return fallbackLocale;
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPath(pathname: string): SupportedLocale | null {
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  if (locales.includes(firstSegment as SupportedLocale)) {
    return firstSegment as SupportedLocale;
  }

  return null;
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (!locale) return pathname;

  return pathname.replace(`/${locale}`, '') || '/';
}

/**
 * Add locale to pathname
 */
export function addLocaleToPath(pathname: string, locale: SupportedLocale): string {
  if (locale === defaultLocale) return pathname;

  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `/${locale}${cleanPath}`;
}

/**
 * Format number according to locale
 */
export function formatNumber(
  value: number,
  locale: SupportedLocale,
  options?: Intl.NumberFormatOptions
): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-GB',
    ur: 'ur',
    ar: 'ar',
    pl: 'pl-PL',
    hi: 'hi-IN',
  };

  return new Intl.NumberFormat(localeMap[locale], options).format(value);
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: SupportedLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-GB',
    ur: 'ur',
    ar: 'ar-SA',
    pl: 'pl-PL',
    hi: 'hi-IN',
  };

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeMap[locale], options).format(dateObj);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
  value: number,
  currency: string = 'GBP',
  locale: SupportedLocale
): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-GB',
    ur: 'en-GB', // Fall back to English for currency
    ar: 'ar-SA',
    pl: 'pl-PL',
    hi: 'hi-IN',
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
  }).format(value);
}