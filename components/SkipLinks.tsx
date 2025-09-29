"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSkipLinks, announceToScreenReader } from "@/lib/accessibility";

interface SkipLink {
  href: string;
  text: string;
  priority?: number;
  category?: 'navigation' | 'content' | 'emergency' | 'footer';
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultSkipLinks: SkipLink[] = [
  {
    href: "#main-content",
    text: "Skip to main content",
    priority: 1,
    category: "content"
  },
  {
    href: "#navigation",
    text: "Skip to navigation",
    priority: 2,
    category: "navigation"
  },
  {
    href: "#emergency-contacts",
    text: "Skip to emergency contacts",
    priority: 0,
    category: "emergency"
  },
  {
    href: "#footer",
    text: "Skip to footer",
    priority: 3,
    category: "footer"
  }
];

export default function SkipLinks({
  links = defaultSkipLinks,
  className = ""
}: SkipLinksProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [focusedLink, setFocusedLink] = useState<string | null>(null);

  useEffect(() => {
    let isTabNavigation = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        isTabNavigation = true;
        setIsVisible(true);

        // Announce skip links availability to screen readers
        if (!isVisible) {
          announceToScreenReader("Skip links available. Use Tab to navigate.", "polite");
        }
      }
    };

    const handleMouseDown = () => {
      isTabNavigation = false;
      setIsVisible(false);
      setFocusedLink(null);
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target?.classList.contains('skip-link')) {
        setFocusedLink(target.getAttribute('href'));
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target?.classList.contains('skip-link')) {
        // Keep focus indicator visible briefly after blur
        setTimeout(() => {
          setFocusedLink(null);
        }, 150);
      }
    };

    // Handle clicks outside skip links
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest('.skip-links-container')) {
        setIsVisible(false);
        setFocusedLink(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible]);

  const handleSkipLinkClick = (href: string, text: string) => {
    // Find the target element
    const targetElement = document.querySelector(href) as HTMLElement | null;

    if (targetElement) {
      // Set focus to target element
      targetElement.focus();

      // If the target element is not naturally focusable, make it focusable temporarily
      if (!targetElement.hasAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');
      }

      // Scroll to the element smoothly
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Announce to screen readers
      announceToScreenReader(`Skipped to ${text}`, "assertive");

      // Hide skip links after use
      setIsVisible(false);
      setFocusedLink(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, href: string, text: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSkipLinkClick(href, text);
    }

    if (e.key === 'Escape') {
      setIsVisible(false);
      setFocusedLink(null);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`skip-links-container ${className}`}
          role="navigation"
          aria-label="Skip navigation links"
        >
          <div className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 shadow-lg">
            <div className="container-main py-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-3 flex items-center">
                  Skip to:
                </span>

                {links
                  .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                  .map((link) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileFocus={{ scale: 1.05 }}
                      onClick={() => handleSkipLinkClick(link.href, link.text)}
                      onKeyDown={(e) => handleKeyDown(e, link.href, link.text)}
                      className={`
                        skip-link inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                        ${focusedLink === link.href
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600 focus:bg-primary-50 focus:text-primary-600'
                        }
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      `}
                      aria-current={focusedLink === link.href ? 'true' : undefined}
                    >
                      {link.text}
                      {link.category === 'emergency' && (
                        <span className="ml-1 text-red-500" aria-label="Emergency">
                          🚨
                        </span>
                      )}
                    </motion.button>
                  ))}
              </div>

              {/* Instructions for screen readers */}
              <div className="sr-only">
                Press Tab to navigate through skip links, Enter or Space to activate,
                Escape to close. These links help you jump directly to different sections of the page.
              </div>
            </div>
          </div>

          {/* Invisible overlay to capture focus */}
          <div
            className="fixed inset-0 -z-10"
            tabIndex={-1}
            onFocus={() => {
              // If focus reaches this overlay, redirect to first skip link
              const firstLink = document.querySelector('.skip-link') as HTMLElement;
              firstLink?.focus();
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing skip links in components
export function useSkipLinks() {
  const useAddSkipTarget = (id: string, title: string) => {
    useEffect(() => {
      const element = document.getElementById(id) as HTMLElement | null;
      if (element) {
        // Ensure the element can receive focus
        if (!element.hasAttribute('tabindex') && !element.matches('input, button, a, select, textarea, [contenteditable]')) {
          element.setAttribute('tabindex', '-1');
        }

        // Add ARIA label if not present
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          element.setAttribute('aria-label', title);
        }

        // Add role if appropriate
        if (!element.hasAttribute('role') && element.tagName.toLowerCase() === 'main') {
          element.setAttribute('role', 'main');
        }

        // Handle focus events
        const handleFocus = () => {
          announceToScreenReader(`${title} section focused`, "polite");
        };

        element.addEventListener('focus', handleFocus);

        return () => {
          element.removeEventListener('focus', handleFocus);
        };
      }
    }, [id, title]);
  };

  return { useAddSkipTarget };
}