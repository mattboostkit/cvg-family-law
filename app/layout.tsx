import type { Metadata } from "next";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${openSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
