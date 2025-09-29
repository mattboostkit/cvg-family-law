'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SupportedLocale } from '@/types/i18n';
import {
  locales,
  getDirection,
  getLanguageName,
  getNativeLanguageName,
  isRTL,
  addLocaleToPath,
  removeLocaleFromPath
} from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
  culturalNotes?: string;
}

const languageInfo: Record<SupportedLocale, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    isRTL: false,
    culturalNotes: 'Primary language for legal services in Kent and South East England',
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    isRTL: true,
    culturalNotes: 'Commonly spoken by Pakistani and Bangladeshi communities',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    isRTL: true,
    culturalNotes: 'Used by Middle Eastern and North African communities',
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    isRTL: false,
    culturalNotes: 'Widely spoken by Eastern European communities',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    isRTL: false,
    culturalNotes: 'Common language for Indian community members',
  },
};

interface LanguageSwitcherProps {
  variant?: 'button' | 'select';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showFlags?: boolean;
  showNativeNames?: boolean;
  culturalSensitivity?: boolean;
}

export default function LanguageSwitcher({
  variant = 'select',
  size = 'md',
  className,
  showFlags = true,
  showNativeNames = true,
  culturalSensitivity = true,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get current locale from pathname or cookie
    const localeInPath = pathname.split('/')[1] as SupportedLocale;
    if (locales.includes(localeInPath)) {
      setCurrentLocale(localeInPath);
    } else {
      const savedLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
        ?.split('=')[1] as SupportedLocale;

      if (savedLocale && locales.includes(savedLocale)) {
        setCurrentLocale(savedLocale);
      }
    }
  }, [pathname]);

  const switchLanguage = (newLocale: SupportedLocale) => {
    const currentPath = removeLocaleFromPath(pathname);
    const newPath = addLocaleToPath(currentPath, newLocale);

    // Set cookie for the new locale
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Navigate to new path
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLangInfo = languageInfo[currentLocale];
  const direction = getDirection(currentLocale);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  if (variant === 'button') {
    return (
      <div className={cn('flex gap-1', className)}>
        {locales.map((locale) => (
          <Button
            key={locale}
            variant={currentLocale === locale ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchLanguage(locale)}
            className={cn(
              sizeClasses[size],
              'flex items-center gap-1',
              direction === 'rtl' && 'flex-row-reverse'
            )}
          >
            {showFlags && (
              <span role="img" aria-label={`${languageInfo[locale].name} flag`}>
                {languageInfo[locale].flag}
              </span>
            )}
            {showNativeNames
              ? languageInfo[locale].nativeName
              : languageInfo[locale].name
            }
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <select
        value={currentLocale}
        onChange={(e) => switchLanguage(e.target.value as SupportedLocale)}
        className={cn(
          'appearance-none bg-background border border-input rounded-md px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
          'cursor-pointer pr-8',
          direction === 'rtl' && 'text-right',
          sizeClasses[size]
        )}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {showFlags && `${languageInfo[locale].flag} `}
            {showNativeNames
              ? languageInfo[locale].nativeName
              : languageInfo[locale].name
            }
            {culturalSensitivity && locale !== currentLocale && (
              ` - ${languageInfo[locale].culturalNotes}`
            )}
          </option>
        ))}
      </select>
      <div className={cn(
        'absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none',
        direction === 'rtl' && 'left-0 right-auto'
      )}>
        <Globe className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}