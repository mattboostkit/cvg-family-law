import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import EnhancedHeader from "@/components/layout/EnhancedHeader";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingConsultation from "@/components/FloatingConsultation";
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
  title: "CVG Family Law - Family Law Specialists in Tunbridge Wells, Kent",
  description: "Forward-thinking family law firm specializing in domestic abuse, children law, divorce, and financial matters. Compassionate legal support in Tunbridge Wells, Kent.",
  keywords: "family law, divorce solicitor, domestic abuse lawyer, children law, Tunbridge Wells, Kent",
  authors: [{ name: "CVG Family Law" }],
  openGraph: {
    title: "CVG Family Law - Family Law Specialists",
    description: "Expert family law services in Tunbridge Wells, Kent. Free 30-minute consultation.",
    url: "https://cvgfamilylaw.co.uk",
    siteName: "CVG Family Law",
    locale: "en_GB",
    type: "website",
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
        <EnhancedHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <FloatingConsultation />
        <CookieBanner />
      </body>
    </html>
  );
}
