"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Shield, Settings, Check } from "lucide-react";
import Link from "next/link";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already set cookie preferences
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      // Small delay to prevent banner from appearing immediately
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(hasConsent);
        setPreferences(saved);
      } catch (e) {
        // Invalid data, show banner again
        setShowBanner(true);
      }
    }
    
    // Listen for cookie settings button click from footer
    const handleOpenSettings = () => {
      setShowBanner(true);
      setShowSettings(true);
    };
    
    window.addEventListener('openCookieSettings', handleOpenSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptSelected = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    setShowBanner(false);
    setShowSettings(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setShowSettings(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-warmgray-200 overflow-hidden">
                {!showSettings ? (
                  // Main Banner View
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex w-12 h-12 bg-primary-100 rounded-full items-center justify-center flex-shrink-0">
                        <Cookie className="h-6 w-6 text-primary-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-warmgray-900 mb-2">
                              We care about your privacy
                            </h3>
                            <p className="text-sm text-warmgray-600 mb-4 max-w-3xl">
                              We use cookies to enhance your browsing experience, provide personalized content, 
                              and analyze our traffic. We prioritize your privacy and only collect necessary 
                              data to improve our services to families in need of legal support.{" "}
                              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                                Learn more in our Privacy Policy
                              </Link>
                            </p>
                          </div>
                          
                          <button
                            onClick={() => setShowBanner(false)}
                            className="text-warmgray-400 hover:text-warmgray-600 p-1"
                            aria-label="Close cookie banner"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={acceptAll}
                            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Accept All
                          </button>
                          
                          <button
                            onClick={rejectAll}
                            className="bg-warmgray-100 text-warmgray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-warmgray-200 transition-colors"
                          >
                            Reject All
                          </button>
                          
                          <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="bg-white text-warmgray-700 px-6 py-2.5 rounded-lg font-medium border border-warmgray-300 hover:bg-warmgray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Manage Preferences
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Settings View
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-warmgray-900">
                          Cookie Preferences
                        </h3>
                      </div>
                      
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-warmgray-400 hover:text-warmgray-600 p-1"
                        aria-label="Close settings"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      {/* Necessary Cookies */}
                      <div className="bg-warmgray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-warmgray-900 mb-1">
                              Necessary Cookies
                            </h4>
                            <p className="text-sm text-warmgray-600">
                              Essential for the website to function properly. These cannot be disabled.
                            </p>
                          </div>
                          <div className="ml-4">
                            <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-not-allowed opacity-60">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="bg-white border border-warmgray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-warmgray-900 mb-1">
                              Analytics Cookies
                            </h4>
                            <p className="text-sm text-warmgray-600">
                              Help us understand how visitors interact with our website to improve user experience.
                            </p>
                          </div>
                          <button
                            onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                            className="ml-4"
                            aria-label="Toggle analytics cookies"
                          >
                            <div className={`w-12 h-6 rounded-full relative transition-colors ${
                              preferences.analytics ? 'bg-primary-600' : 'bg-warmgray-300'
                            }`}>
                              <motion.div
                                animate={{ x: preferences.analytics ? 20 : 0 }}
                                className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"
                              />
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Marketing Cookies */}
                      <div className="bg-white border border-warmgray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-warmgray-900 mb-1">
                              Marketing Cookies
                            </h4>
                            <p className="text-sm text-warmgray-600">
                              Used to provide you with relevant content and measure advertising effectiveness.
                            </p>
                          </div>
                          <button
                            onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                            className="ml-4"
                            aria-label="Toggle marketing cookies"
                          >
                            <div className={`w-12 h-6 rounded-full relative transition-colors ${
                              preferences.marketing ? 'bg-primary-600' : 'bg-warmgray-300'
                            }`}>
                              <motion.div
                                animate={{ x: preferences.marketing ? 20 : 0 }}
                                className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"
                              />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={acceptSelected}
                        className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Save Preferences
                      </button>
                      
                      <button
                        onClick={acceptAll}
                        className="bg-warmgray-100 text-warmgray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-warmgray-200 transition-colors"
                      >
                        Accept All
                      </button>
                      
                      <button
                        onClick={rejectAll}
                        className="bg-white text-warmgray-700 px-6 py-2.5 rounded-lg font-medium border border-warmgray-300 hover:bg-warmgray-50 transition-colors"
                      >
                        Reject All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}