import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/lib/i18n';
import { getTranslations, getDirection } from '@/lib/i18n';
import type { SupportedLocale } from '@/types/i18n';
import { Inter, DM_Sans, Cairo, Noto_Sans_Arabic, Noto_Sans } from 'next/font/google';

// Font configurations for different languages
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: false,
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  preload: false,
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  display: 'swap',
  preload: false,
});

const notoSans = Noto_Sans({
  subsets: ['latin', 'devanagari'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: false,
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Validate that the locale parameter is valid
function isValidLocale(locale: string): locale is SupportedLocale {
  return locales.includes(locale as SupportedLocale);
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  const translations = getTranslations(locale);
  const direction = getDirection(locale);

  // Select appropriate font variables based on locale
  const getFontVariables = (locale: SupportedLocale) => {
    switch (locale) {
      case 'ar':
        return `${cairo.variable} ${notoSansArabic.variable}`;
      case 'ur':
        return `${cairo.variable} ${notoSansArabic.variable}`;
      case 'hi':
        return `${notoSans.variable}`;
      case 'pl':
        return `${inter.variable} ${dmSans.variable}`;
      case 'en':
      default:
        return `${inter.variable} ${dmSans.variable}`;
    }
  };

  const fontVariables = getFontVariables(locale);

  return (
    <html lang={locale} dir={direction} className={fontVariables}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const translations = getTranslations(locale);
  const direction = getDirection(locale);

  return {
    title: {
      default: 'CVG Solicitors - Domestic Abuse Law Firm',
      template: `%s | CVG Solicitors`
    },
    description: translations.services.description,
    keywords: [
      'domestic abuse lawyer',
      'family law',
      'solicitors Kent',
      'legal aid',
      locale === 'ur' && 'گھریلو تشدد وکیل',
      locale === 'ar' && 'محامي العنف الأسري',
      locale === 'pl' && 'adwokat przemocy domowej',
      locale === 'hi' && 'घरेलू हिंसा वकील',
    ].filter(Boolean),
    authors: [{ name: 'CVG Solicitors' }],
    creator: 'CVG Solicitors',
    publisher: 'CVG Solicitors',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://cvgsolicitors.co.uk'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ur': '/ur',
        'ar': '/ar',
        'pl': '/pl',
        'hi': '/hi',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: `/${locale}`,
      title: 'CVG Solicitors - Domestic Abuse Law Firm',
      description: translations.services.description,
      siteName: 'CVG Solicitors',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CVG Solicitors - Domestic Abuse Law Firm',
      description: translations.services.description,
      creator: '@cvgsolicitors',
    },
    verification: {
      google: 'google-site-verification-code',
    },
  };
}