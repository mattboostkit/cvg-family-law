"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Eye,
  Type,
  MousePointer,
  Volume2,
  Monitor,
  Sun,
  Moon,
  RotateCcw,
  X
} from "lucide-react";
import {
  getAccessibilityPreferences,
  saveAccessibilityPreferences,
  announceToScreenReader,
  type AccessibilityPreferences
} from "@/lib/accessibility";

interface AccessibilityControlsProps {
  variant?: 'floating' | 'modal' | 'inline';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export default function AccessibilityControls({
  variant = 'floating',
  position = 'bottom-right',
  className = ""
}: AccessibilityControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    focusVisible: true,
  });

  // Load preferences on mount
  useEffect(() => {
    const savedPreferences = getAccessibilityPreferences();
    setPreferences(savedPreferences);
  }, []);

  // Apply preferences when they change
  useEffect(() => {
    saveAccessibilityPreferences(preferences);
  }, [preferences]);

  const updatePreference = (key: keyof AccessibilityPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    // Announce change to screen readers
    const preferenceLabels = {
      reducedMotion: value ? 'Reduced motion enabled' : 'Reduced motion disabled',
      highContrast: value ? 'High contrast mode enabled' : 'High contrast mode disabled',
      largeText: value ? 'Large text enabled' : 'Large text disabled',
      focusVisible: value ? 'Focus indicators enabled' : 'Focus indicators disabled',
    };

    announceToScreenReader(preferenceLabels[key], "assertive");
  };

  const resetPreferences = () => {
    const defaultPreferences: AccessibilityPreferences = {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      focusVisible: true,
    };
    setPreferences(defaultPreferences);
    announceToScreenReader("Accessibility preferences reset to defaults", "assertive");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (variant === 'floating') {
    return (
      <>
        {/* Floating trigger button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            fixed z-40 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${position === 'bottom-right' ? 'bottom-6 right-6' : ''}
            ${position === 'bottom-left' ? 'bottom-6 left-6' : ''}
            ${position === 'top-right' ? 'top-6 right-6' : ''}
            ${position === 'top-left' ? 'top-6 left-6' : ''}
            ${className}
          `}
          aria-label="Open accessibility controls"
          aria-expanded={isOpen}
          aria-controls="accessibility-controls-panel"
        >
          <Settings className="h-6 w-6" />
        </motion.button>

        {/* Accessibility controls panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="accessibility-controls-panel"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`
                fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[320px]
                ${position === 'bottom-right' ? 'bottom-20 right-6' : ''}
                ${position === 'bottom-left' ? 'bottom-20 left-6' : ''}
                ${position === 'top-right' ? 'top-20 right-6' : ''}
                ${position === 'top-left' ? 'top-20 left-6' : ''}
              `}
              role="dialog"
              aria-labelledby="accessibility-controls-title"
              aria-modal="true"
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="accessibility-controls-title" className="text-lg font-semibold text-gray-900">
                  Accessibility Controls
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                  aria-label="Close accessibility controls"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* High Contrast Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Monitor className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        High Contrast
                      </label>
                      <p className="text-xs text-gray-500">
                        Increase contrast for better visibility
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePreference('highContrast', !preferences.highContrast)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${preferences.highContrast ? 'bg-primary-600' : 'bg-gray-200'}
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    `}
                    role="switch"
                    aria-checked={preferences.highContrast}
                    aria-label="Toggle high contrast mode"
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${preferences.highContrast ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Volume2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Reduce Motion
                      </label>
                      <p className="text-xs text-gray-500">
                        Minimize animations and transitions
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${preferences.reducedMotion ? 'bg-primary-600' : 'bg-gray-200'}
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    `}
                    role="switch"
                    aria-checked={preferences.reducedMotion}
                    aria-label="Toggle reduced motion"
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Large Text */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Type className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Large Text
                      </label>
                      <p className="text-xs text-gray-500">
                        Increase text size for better readability
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePreference('largeText', !preferences.largeText)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${preferences.largeText ? 'bg-primary-600' : 'bg-gray-200'}
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    `}
                    role="switch"
                    aria-checked={preferences.largeText}
                    aria-label="Toggle large text"
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${preferences.largeText ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Focus Indicators */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MousePointer className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Focus Indicators
                      </label>
                      <p className="text-xs text-gray-500">
                        Show focus outlines for keyboard navigation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePreference('focusVisible', !preferences.focusVisible)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${preferences.focusVisible ? 'bg-primary-600' : 'bg-gray-200'}
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    `}
                    role="switch"
                    aria-checked={preferences.focusVisible}
                    aria-label="Toggle focus indicators"
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${preferences.focusVisible ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>

              {/* Reset button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={resetPreferences}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                  aria-label="Reset all accessibility preferences to defaults"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> You can also use keyboard shortcuts:
                  Alt+E for emergency contacts, Alt+S for search, Alt+M for main content.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </>
    );
  }

  // Inline variant for embedding in other components
  if (variant === 'inline') {
    return (
      <div className={`accessibility-controls-inline ${className}`}>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Accessibility Options
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updatePreference('highContrast', !preferences.highContrast)}
            className={`
              flex items-center gap-2 p-2 rounded-lg text-sm transition-colors
              ${preferences.highContrast
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            `}
            aria-pressed={preferences.highContrast}
          >
            <Monitor className="h-4 w-4" />
            High Contrast
          </button>

          <button
            onClick={() => updatePreference('largeText', !preferences.largeText)}
            className={`
              flex items-center gap-2 p-2 rounded-lg text-sm transition-colors
              ${preferences.largeText
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            `}
            aria-pressed={preferences.largeText}
          >
            <Type className="h-4 w-4" />
            Large Text
          </button>

          <button
            onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
            className={`
              flex items-center gap-2 p-2 rounded-lg text-sm transition-colors
              ${preferences.reducedMotion
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            `}
            aria-pressed={preferences.reducedMotion}
          >
            <Volume2 className="h-4 w-4" />
            Reduce Motion
          </button>

          <button
            onClick={resetPreferences}
            className="flex items-center gap-2 p-2 rounded-lg text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// Hook for using accessibility preferences in components
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    focusVisible: true,
  });

  useEffect(() => {
    const savedPreferences = getAccessibilityPreferences();
    setPreferences(savedPreferences);
  }, []);

  return preferences;
}