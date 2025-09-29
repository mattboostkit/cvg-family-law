import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import Script from "next/script";
import EnhancedHeader from "@/components/layout/EnhancedHeader";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingConsultation from "@/components/FloatingConsultation";
import EmergencySystem from "@/components/EmergencySystem";
import SkipLinks from "@/components/SkipLinks";
import AccessibilityControls from "@/components/AccessibilityControls";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import { WebVitalsTracker } from "@/lib/web-vitals";
import { initializeAccessibility } from "@/lib/accessibility";
import { siteConfig } from "@/lib/constants";
import {
  organizationSchema,
  localBusinessSchema,
  emergencyContactSchema,
  domesticAbuseServiceSchema,
  faqSchema,
  reviewSolicitorsWidgetSchema,
  sraApprovalSchema
} from "@/lib/schema";
import {
  voiceSearchSchema,
  locationBasedVoiceSchema,
  emergencyVoiceSchema
} from "@/lib/voice-search-schema";
import "./globals.css";
import "./accessibility.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "CVG Family Law - Family Law Specialists in Tunbridge Wells, Kent",
    template: "%s | CVG Family Law",
  },
  description:
    "24/7 emergency family law support for domestic abuse victims in Kent. Expert solicitors providing immediate protection orders, non-molestation orders & urgent legal help. Free consultation. SRA regulated.",
  keywords: [
    // Core Services
    "family law", "domestic abuse solicitor", "divorce lawyer", "children law",

    // Location-based
    "Tunbridge Wells", "Kent", "Sevenoaks", "Maidstone", "Tonbridge",

    // Emergency & Crisis Keywords
    "emergency injunctions", "emergency protection order", "urgent legal help",
    "crisis legal support", "domestic violence lawyer", "restraining order",
    "non-molestation order", "occupation order", "immediate court order",
    "24/7 legal help", "emergency family lawyer", "urgent injunction",
    "immediate legal protection", "domestic abuse emergency",

    // Specific Legal Terms
    "family law Tunbridge Wells", "domestic abuse Kent", "emergency solicitor",
    "protection order Kent", "family court emergency", "urgent divorce",
    "child protection order", "domestic violence injunction",

    // Help-Seeking Keywords
    "need help now", "legal help domestic abuse", "emergency family law",
    "immediate legal advice", "crisis family lawyer", "urgent court order",
    "emergency child protection", "immediate family lawyer"
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
    title: "CVG Family Law - 24/7 Emergency Family Law Support in Kent",
    description:
      "Urgent legal help for domestic abuse victims. Emergency protection orders, non-molestation orders & immediate court injunctions. 24/7 crisis support across Kent.",
    url: siteConfig.url,
    siteName: "CVG Family Law",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVG Family Law - Emergency Domestic Abuse Solicitors Kent",
    description:
      "24/7 urgent legal support for domestic abuse victims. Emergency protection orders & immediate family law help across Tunbridge Wells, Sevenoaks, Maidstone & Tonbridge.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Skip Links for keyboard navigation */}
        <SkipLinks />

        {/* Emergency System - loads first and is always visible */}
        <EmergencySystem variant="banner" />

        <EnhancedHeader />
        <main id="main-content" className="flex-1" role="main" aria-label="Main content">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <FloatingConsultation />
        <CookieBanner />

        {/* Full Emergency System Modal */}
        <EmergencySystem variant="full" />

        {/* Accessibility Controls */}
        <AccessibilityControls variant="floating" position="bottom-right" />


      {/* Comprehensive Schema Markup for SEO */}
      <Script id="ld-json-org" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(organizationSchema)}
      </Script>
      <Script id="ld-json-local" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(localBusinessSchema)}
      </Script>
      <Script id="ld-json-emergency" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(emergencyContactSchema)}
      </Script>
      <Script id="ld-json-service" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(domesticAbuseServiceSchema)}
      </Script>
      <Script id="ld-json-faq" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id="ld-json-reviews" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(reviewSolicitorsWidgetSchema)}
      </Script>
      <Script id="ld-json-sra" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(sraApprovalSchema)}
      </Script>
      <Script id="ld-json-voice-search" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(voiceSearchSchema)}
      </Script>
      <Script id="ld-json-location-voice" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(locationBasedVoiceSchema)}
      </Script>
      <Script id="ld-json-emergency-voice" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(emergencyVoiceSchema)}
      </Script>

      {/* Web Vitals Performance Monitoring */}
      <WebVitalsTracker />

      {/* Service Worker Registration for Emergency Offline Access */}
      <Script
        id="service-worker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('[SW] Emergency service worker registered:', registration);
                  })
                  .catch((error) => {
                    console.error('[SW] Emergency service worker registration failed:', error);
                  });
              });
            }
          `,
        }}
      />
      </body>
    </html>
  );
}
