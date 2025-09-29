import { Metadata } from 'next';
import { SupportedLocale } from '@/types/i18n';
import { getTranslations } from '@/lib/i18n';
import HeroSection from '@/components/sections/HeroSection';
import ServicesOverview from '@/components/sections/ServicesOverview';
import HopeSection from '@/components/sections/HopeSection';
import SupportResources from '@/components/sections/SupportResources';
import CTASection from '@/components/sections/CTASection';
import TrustIndicators from '@/components/sections/TrustIndicators';
import Testimonials from '@/components/sections/Testimonials';

interface HomePageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SupportedLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const translations = getTranslations(locale);

  return {
    title: 'CVG Family Law - Family Law Specialists in Tunbridge Wells, Kent',
    description: translations.services.description,
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
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection />
      <TrustIndicators />
      <ServicesOverview />
      <HopeSection />
      <Testimonials />
      <SupportResources />
      <CTASection />
    </>
  );
}