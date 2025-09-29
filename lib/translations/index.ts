import { SupportedLocale, TranslationKeys } from '@/types/i18n';
import { enTranslations } from './en';
import { urTranslations } from './ur';
import { arTranslations } from './ar';
import { plTranslations } from './pl';
import { hiTranslations } from './hi';

export const translations: Record<SupportedLocale, TranslationKeys> = {
  en: enTranslations,
  ur: urTranslations,
  ar: arTranslations,
  pl: plTranslations,
  hi: hiTranslations,
};

export const getTranslation = (locale: SupportedLocale): TranslationKeys => {
  return translations[locale] || translations.en;
};

export const languageNames: Record<SupportedLocale, string> = {
  en: 'English',
  ur: 'اردو',
  ar: 'العربية',
  pl: 'Polski',
  hi: 'हिन्दी',
};

export const languageNativeNames: Record<SupportedLocale, string> = {
  en: 'English',
  ur: 'اردو',
  ar: 'العربية',
  pl: 'Polski',
  hi: 'हिन्दी',
};

export const rtlLocales: SupportedLocale[] = ['ar', 'ur'];

export const isRTLLocale = (locale: SupportedLocale): boolean => {
  return rtlLocales.includes(locale);
};