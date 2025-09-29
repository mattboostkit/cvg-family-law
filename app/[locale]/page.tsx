import { Metadata } from 'next';
import { SupportedLocale } from '@/types/i18n';
import { getTranslations, getDirection } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface HomePageProps {
  params: {
    locale: SupportedLocale;
  };
}

// Generate metadata for each locale
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: SupportedLocale };
}): Promise<Metadata> {
  const translations = getTranslations(locale);
  const direction = getDirection(locale);

  return {
    title: 'CVG Solicitors - Domestic Abuse Law Firm',
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

export default function HomePage({ params: { locale } }: HomePageProps) {
  const translations = getTranslations(locale);
  const direction = getDirection(locale);

  return (
    <div dir={direction} className="min-h-screen bg-background">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher
          variant="select"
          size="sm"
          showFlags={true}
          showNativeNames={true}
          culturalSensitivity={true}
        />
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          {translations.emergency.title}: {translations.emergency.call999}
        </p>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {translations.services.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {translations.services.description}
          </p>
          <div className="space-y-4">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
              {translations.emergency.callNow}
            </button>
            <p className="text-sm text-muted-foreground">
              {translations.emergency.description}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translations.services.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                {translations.services.domesticAbuse}
              </h3>
              <p className="text-muted-foreground">
                Emergency protection orders and legal support for domestic abuse victims.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                {translations.services.divorce}
              </h3>
              <p className="text-muted-foreground">
                Professional legal guidance through divorce proceedings.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                {translations.services.childrenLaw}
              </h3>
              <p className="text-muted-foreground">
                Protecting children's rights and welfare in family law matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            {translations.navigation.contact}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get in touch for confidential legal support
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Emergency</h3>
              <p className="text-muted-foreground">{translations.emergency.call999}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal Support</h3>
              <p className="text-muted-foreground">24/7 Helpline Available</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Consultation</h3>
              <p className="text-muted-foreground">{translations.booking.title}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}