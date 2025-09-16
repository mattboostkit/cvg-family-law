import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import Script from "next/script";
import EnhancedHeader from "@/components/layout/EnhancedHeader";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingConsultation from "@/components/FloatingConsultation";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "CVG Family Law - Family Law Specialists in Tunbridge Wells, Kent",
    template: "%s | CVG Family Law",
  },
  description:
    "Forward-thinking family law firm specialising in domestic abuse, children law, divorce, and financial matters. Compassionate legal support for families in Tunbridge Wells and across Kent.",
  keywords: [
    "family law",
    "domestic abuse solicitor",
    "divorce lawyer",
    "children law",
    "Tunbridge Wells",
    "Kent",
    "emergency injunctions",
  ],
  authors: [{ name: "CVG Family Law" }],
  creator: "CVG Family Law",
  publisher: "CVG Family Law Ltd",
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-GB": siteConfig.url,
    },
  },
  openGraph: {
    title: "CVG Family Law - Family Law Specialists in Tunbridge Wells, Kent",
    description:
      "Expert family law services for domestic abuse survivors, children matters, divorce, and financial settlements. Free 30-minute consultation.",
    url: siteConfig.url,
    siteName: "CVG Family Law",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVG Family Law - Tunbridge Wells Family Law Solicitors",
    description:
      "Specialist domestic abuse and family law solicitors supporting families across Kent.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: siteConfig.name,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  image: `${siteConfig.url}/logos/Logo_Flat.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.county,
    postalCode: siteConfig.address.postcode,
    addressCountry: "GB",
  },
  areaServed: ["Tunbridge Wells", "Sevenoaks", "Maidstone", "Kent"],
  priceRange: "Consultation from GBP 0",
  sameAs: Object.values(siteConfig.social),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      opens: "09:00",
      closes: "17:30",
    },
  ],
  serviceType: [
    "Domestic Abuse Support",
    "Children Law",
    "Divorce & Separation",
    "Family Financial Matters"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <EnhancedHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <FloatingConsultation />
        <CookieBanner />
        <Script id="ld-json-org" type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </Script>
      </body>
    </html>
  );
}
