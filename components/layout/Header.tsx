"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation, siteConfig, emergencyBannerText } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [showEmergencyBanner] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsServicesOpen(false);
      }
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleQuickExit = () => {
    window.open("https://www.google.com", "_newtab");
    window.location.replace("https://www.google.com");
  };

  return (
    <>
      {showEmergencyBanner && (
        <div className="bg-red-600 text-white px-4 py-3">
          <div className="container-main flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">{emergencyBannerText.heading}</span>
                <span className="hidden sm:inline text-sm">
                  {emergencyBannerText.subheading}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{emergencyBannerText.phoneLabel}</span>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="font-bold underline hover:no-underline"
                >
                  {emergencyBannerText.phone}
                </a>
              </div>
            </div>
            <button
              onClick={handleQuickExit}
              className="bg-white text-red-600 px-4 py-1 rounded text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              {emergencyBannerText.buttonText}
            </button>
          </div>
        </div>
      )}

      <header className={cn(
        "bg-white sticky top-0 z-40 transition-all duration-300",
        isScrolled ? "shadow-lg" : "shadow-sm"
      )}>
        <nav className="container-main">
          <div className={cn(
            "flex justify-between items-center transition-all duration-300",
            isScrolled ? "h-16" : "h-20"
          )}>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary-600">CVG Family Law</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Tunbridge Wells, Kent • SRA: 8007597</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div key={item.label} className="relative">
                  {item.children ? (
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 text-gray-700 hover:text-primary-600 transition-colors py-2 font-medium"
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        onMouseEnter={() => setIsServicesOpen(true)}
                        aria-expanded={isServicesOpen}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isServicesOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {isServicesOpen && (
                        <div
                          className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[250px] mt-2"
                          onMouseLeave={() => setIsServicesOpen(false)}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="hidden xl:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                  aria-label="Call us"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone}
                </a>
                <Link
                  href="/contact"
                  className="btn-primary text-sm shadow-md hover:shadow-lg transition-shadow"
                >
                  Free Consultation
                </Link>
              </div>
            </div>

            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t overflow-hidden"
            >
              <div className="py-4 space-y-1 bg-white">
                {navigation.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          className="flex items-center justify-between w-full text-left px-4 py-3 hover:bg-gray-50 font-medium text-gray-700"
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isServicesOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isServicesOpen && (
                          <div className="bg-gray-50 py-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-8 py-2 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-3 hover:bg-gray-50 font-medium text-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="px-4 pt-4 space-y-3 border-t">
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-2 text-primary-600 font-semibold py-2"
                  >
                    <Phone className="h-4 w-4" />
                    {siteConfig.phone}
                  </a>
                  <Link
                    href="/contact"
                    className="btn-primary block text-center w-full shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Free Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}