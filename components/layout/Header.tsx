"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation, siteConfig, emergencyBannerText } from "@/lib/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [showEmergencyBanner] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

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

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="container-main">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary-600">CVG Family Law</h1>
                <p className="text-xs text-gray-600">Tunbridge Wells, Kent</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div key={item.label} className="relative">
                  {item.children ? (
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 text-gray-700 hover:text-primary-600 transition-colors py-2"
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        onMouseEnter={() => setIsServicesOpen(true)}
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
                      className="text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="btn-primary text-sm"
              >
                Free Consultation
              </Link>
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

          {isMenuOpen && (
            <div className="lg:hidden border-t">
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          className="flex items-center justify-between w-full text-left px-4 py-3 hover:bg-gray-50"
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
                        className="block px-4 py-3 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="px-4 pt-4">
                  <Link
                    href="/contact"
                    className="btn-primary block text-center w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Free Consultation
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}