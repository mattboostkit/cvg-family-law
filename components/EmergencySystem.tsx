"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  X,
  AlertTriangle,
  Shield,
  Heart,
  ExternalLink,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { emergencyContacts } from "@/lib/constants";
import { announceToScreenReader, registerKeyboardShortcuts, COMMON_KEYBOARD_SHORTCUTS } from "@/lib/accessibility";

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  website?: string;
  urgent?: boolean;
}

interface EmergencySystemProps {
  variant?: 'banner' | 'full' | 'minimal';
  className?: string;
}

export default function EmergencySystem({
  variant = 'banner',
  className
}: EmergencySystemProps) {
  const [showFullSystem, setShowFullSystem] = useState(false);

  // Handle quick exit with browser history clearing
  const handleQuickExit = () => {
    try {
      // Clear browser history (limited by browser security)
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', emergencyContacts.safeSites.google);
      }

      // Open safe site in new tab first
      window.open(emergencyContacts.safeSites.google, '_blank');

      // Redirect current page
      window.location.replace(emergencyContacts.safeSites.google);
    } catch {
      // Fallback if history manipulation fails
      window.location.href = emergencyContacts.safeSites.google;
    }
  };

  // One-click emergency calling
  const handleEmergencyCall = (number: string) => {
    try {
      window.location.href = `tel:${number.replace(/\s/g, '')}`;
    } catch {
      // Fallback for older browsers
      window.open(`tel:${number.replace(/\s/g, '')}`);
    }
  };

  // Handle website links safely
  const handleSafeLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key to close full system
      if (event.key === 'Escape' && showFullSystem) {
        setShowFullSystem(false);
        announceToScreenReader("Emergency contacts closed", "polite");
      }

      // Quick access keys (Alt + E for emergency)
      if (event.altKey && event.key === 'e') {
        event.preventDefault();
        setShowFullSystem(!showFullSystem);
        announceToScreenReader(
          showFullSystem ? "Emergency contacts closed" : "Emergency contacts opened",
          "assertive"
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFullSystem]);

  // Register keyboard shortcuts
  useEffect(() => {
    const unregisterShortcuts = registerKeyboardShortcuts([
      {
        key: 'e',
        altKey: true,
        handler: () => {
          setShowFullSystem(!showFullSystem);
          announceToScreenReader(
            showFullSystem ? "Emergency contacts closed" : "Emergency contacts opened",
            "assertive"
          );
        },
        description: 'Toggle emergency contacts'
      }
    ]);

    return unregisterShortcuts;
  }, [showFullSystem]);

  // Emergency banner (always visible)
  if (variant === 'banner' || variant === 'minimal') {
    return (
      <motion.div
        id="emergency-contacts"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden",
          className
        )}
        role="region"
        aria-label="Emergency support and contact information"
        aria-live="polite"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>

        <div className="container-main py-2 relative">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Emergency indicator and primary actions */}
            <div className="flex items-center gap-4 flex-wrap">
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="h-4 w-4 text-yellow-300 drop-shadow-sm" />
                <span className="font-bold text-sm tracking-wide">
                  EMERGENCY SUPPORT
                </span>
              </motion.div>

              {/* Primary emergency call button */}
              <button
                onClick={() => handleEmergencyCall(emergencyContacts.emergencyServices.police.number)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
                aria-label="Call emergency services (999)"
                type="button"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">999</span>
                <span className="text-xs opacity-90">Emergency</span>
              </button>

              {/* Firm emergency line */}
              <button
                onClick={() => handleEmergencyCall(emergencyContacts.emergencyServices.firm.number)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg font-semibold text-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
                aria-label="Call CVG Family Law emergency line"
                type="button"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">{emergencyContacts.emergencyServices.firm.number}</span>
                <span className="text-xs opacity-90">Legal Support</span>
              </button>
            </div>

            {/* Quick exit and expand button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickExit}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Quick exit to safe website"
              >
                QUICK EXIT →
              </button>

              {variant === 'banner' && (
                <button
                  onClick={() => setShowFullSystem(true)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-2 py-1.5 rounded-lg text-xs transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Show all emergency contacts"
                >
                  MORE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accessibility announcement for screen readers */}
        <div className="sr-only" aria-live="polite">
          Emergency support system active. Press Alt+E for full emergency contacts.
        </div>
      </motion.div>
    );
  }

  // Full emergency system modal
  if (variant === 'full') {
    return (
      <AnimatePresence>
        {showFullSystem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="emergency-modal-title"
            aria-describedby="emergency-modal-description"
          >
            <div className="min-h-screen px-4 py-6">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Shield className="h-8 w-8" aria-hidden="true" />
                      </motion.div>
                      <div>
                        <h1 id="emergency-modal-title" className="text-2xl font-bold">Emergency Support</h1>
                        <p id="emergency-modal-description" className="text-red-100">Immediate help and support services</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowFullSystem(false)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
                      aria-label="Close emergency contacts"
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Emergency Contacts Grid */}
                <div className="bg-white rounded-b-2xl p-6 space-y-6">
                  {/* Immediate Emergency Actions */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Immediate Emergency
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => handleEmergencyCall(emergencyContacts.emergencyServices.police.number)}
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full"
                        aria-label="Call emergency services on 999"
                      >
                        <div className="flex items-center gap-3">
                          <Phone className="h-6 w-6" aria-hidden="true" />
                          <div className="text-left">
                            <div className="text-sm opacity-90">Call Emergency Services</div>
                            <div className="text-xl">999</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleEmergencyCall(emergencyContacts.emergencyServices.firm.number)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
                        aria-label={`Call CVG Family Law emergency line on ${emergencyContacts.emergencyServices.firm.number}`}
                      >
                        <div className="flex items-center gap-3">
                          <Phone className="h-6 w-6" aria-hidden="true" />
                          <div className="text-left">
                            <div className="text-sm opacity-90">CVG Emergency Line</div>
                            <div className="text-lg">{emergencyContacts.emergencyServices.firm.number}</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* National Helplines */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                      National Helplines
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(emergencyContacts.helplines).map(([key, contact]) => (
                        <EmergencyContactCard
                          key={key}
                          contact={contact}
                          onCall={() => handleEmergencyCall(contact.number)}
                          onVisit={() => contact.website && handleSafeLink(contact.website)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Local Services */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Local Kent Services
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(emergencyContacts.localServices).map(([key, contact]) => (
                        <EmergencyContactCard
                          key={key}
                          contact={contact}
                          onCall={() => handleEmergencyCall(contact.number)}
                          onVisit={() => contact.website && handleSafeLink(contact.website)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-6 border-t">
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={handleQuickExit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Quick Exit to Safe Site
                      </button>
                      <button
                        onClick={() => setShowFullSystem(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Close Emergency Contacts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return null;
}

// Emergency Contact Card Component
function EmergencyContactCard({
  contact,
  onCall,
  onVisit
}: {
  contact: EmergencyContact;
  onCall: () => void;
  onVisit?: () => void;
}) {
  return (
    <div
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all transform hover:scale-105 hover:shadow-lg"
      role="article"
      aria-labelledby={`contact-${contact.name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3
          id={`contact-${contact.name.replace(/\s+/g, '-').toLowerCase()}`}
          className="font-bold text-gray-900 text-sm"
        >
          {contact.name}
        </h3>
        {contact.urgent && (
          <span
            className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full"
            role="status"
            aria-label="Available 24 hours a day, 7 days a week"
          >
            24/7
          </span>
        )}
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{contact.description}</p>

      <div className="flex flex-col gap-2">
        <button
          onClick={onCall}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label={`Call ${contact.name} on ${contact.number}`}
        >
          <Phone className="h-3 w-3" aria-hidden="true" />
          {contact.number}
        </button>

        {contact.website && onVisit && (
          <button
            onClick={onVisit}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Visit ${contact.name} website (opens in new tab)`}
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            Visit Website
          </button>
        )}
      </div>
    </div>
  );
}