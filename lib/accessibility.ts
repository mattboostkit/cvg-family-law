/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 * Provides utilities for color contrast, focus management, keyboard navigation,
 * screen reader support, and accessibility preferences
 */

// Color contrast utilities for WCAG 2.1 AA compliance
export interface ColorContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'FAIL';
  isCompliant: boolean;
}

/**
 * Calculate color contrast ratio between two hex colors
 * WCAG 2.1 AA requires 4.5:1 for normal text, 3:1 for large text
 * WCAG 2.1 AAA requires 7:1 for normal text, 4.5:1 for large text
 */
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a hex color
 */
function getRelativeLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if color combination meets WCAG 2.1 AA standards
 */
export function checkWCAGCompliance(
  foreground: string,
  background: string,
  isLargeText = false
): ColorContrastResult {
  const ratio = getContrastRatio(foreground, background);

  let level: 'AAA' | 'AA' | 'FAIL' = 'FAIL';
  let isCompliant = false;

  if (isLargeText) {
    // Large text requirements
    if (ratio >= 4.5) {
      level = 'AAA';
      isCompliant = true;
    } else if (ratio >= 3) {
      level = 'AA';
      isCompliant = true;
    }
  } else {
    // Normal text requirements
    if (ratio >= 7) {
      level = 'AAA';
      isCompliant = true;
    } else if (ratio >= 4.5) {
      level = 'AA';
      isCompliant = true;
    }
  }

  return { ratio: Math.round(ratio * 100) / 100, level, isCompliant };
}

// Focus management utilities
export interface FocusTrapOptions {
  container: HTMLElement;
  firstFocusableSelector?: string;
  lastFocusableSelector?: string;
}

/**
 * Create a focus trap within a container
 */
export function createFocusTrap(options: FocusTrapOptions): {
  activate: () => void;
  deactivate: () => void;
} {
  const {
    container,
    firstFocusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    lastFocusableSelector = firstFocusableSelector
  } = options;

  let isActive = false;
  let firstFocusableElement: HTMLElement | null = null;
  let lastFocusableElement: HTMLElement | null = null;

  const getFocusableElements = (): HTMLElement[] => {
    const elements = container.querySelectorAll(firstFocusableSelector);
    return Array.from(elements).filter((el): el is HTMLElement => {
      const htmlEl = el as HTMLElement;
      return htmlEl.offsetParent !== null && !htmlEl.hasAttribute('disabled');
    });
  };

  const updateFocusableElements = () => {
    const focusableElements = getFocusableElements();
    firstFocusableElement = focusableElements[0] || null;
    lastFocusableElement = focusableElements[focusableElements.length - 1] || null;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive || e.key !== 'Tab') return;

    updateFocusableElements();

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement?.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement?.focus();
      }
    }
  };

  const activate = () => {
    isActive = true;
    updateFocusableElements();
    document.addEventListener('keydown', handleKeyDown);
    firstFocusableElement?.focus();
  };

  const deactivate = () => {
    isActive = false;
    document.removeEventListener('keydown', handleKeyDown);
  };

  return { activate, deactivate };
}

/**
 * Manage focus for modal dialogs
 */
export function manageModalFocus(
  triggerElement: HTMLElement,
  modalElement: HTMLElement,
  previouslyFocusedElement?: HTMLElement
): () => void {
  const previouslyActiveElement = previouslyFocusedElement || document.activeElement as HTMLElement;

  const focusTrap = createFocusTrap({ container: modalElement });
  focusTrap.activate();

  const returnFocus = () => {
    focusTrap.deactivate();
    triggerElement.focus();
  };

  // Handle escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      returnFocus();
    }
  };

  modalElement.addEventListener('keydown', handleKeyDown);

  return returnFocus;
}

// Screen reader utilities
/**
 * Announce text to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Debounced screen reader announcements
 */
export function createScreenReaderAnnouncer() {
  let timeoutId: NodeJS.Timeout | null = null;

  return {
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite', delay = 100) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        announceToScreenReader(message, priority);
      }, delay);
    }
  };
}

// Keyboard navigation utilities
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  handler: () => void;
  description: string;
}

/**
 * Register keyboard shortcuts
 */
export function registerKeyboardShortcuts(shortcuts: KeyboardShortcut[]): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      return shortcut.key.toLowerCase() === e.key.toLowerCase() &&
             !!shortcut.ctrlKey === e.ctrlKey &&
             !!shortcut.altKey === e.altKey &&
             !!shortcut.shiftKey === e.shiftKey &&
             !!shortcut.metaKey === e.metaKey;
    });

    if (matchingShortcut) {
      e.preventDefault();
      matchingShortcut.handler();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

// Accessibility preferences
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  focusVisible: boolean;
}

/**
 * Get accessibility preferences from localStorage or system preferences
 */
export function getAccessibilityPreferences(): AccessibilityPreferences {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('accessibility-preferences') : null;

  const defaultPreferences: AccessibilityPreferences = {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    focusVisible: true,
  };

  if (stored) {
    try {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    } catch {
      return defaultPreferences;
    }
  }

  // Check system preferences
  if (typeof window !== 'undefined' && window.matchMedia) {
    defaultPreferences.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    defaultPreferences.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
  }

  return defaultPreferences;
}

/**
 * Save accessibility preferences to localStorage
 */
export function saveAccessibilityPreferences(preferences: Partial<AccessibilityPreferences>): void {
  if (typeof window === 'undefined') return;

  const current = getAccessibilityPreferences();
  const updated = { ...current, ...preferences };

  localStorage.setItem('accessibility-preferences', JSON.stringify(updated));

  // Apply preferences to document
  applyAccessibilityPreferences(updated);
}

/**
 * Apply accessibility preferences to the document
 */
export function applyAccessibilityPreferences(preferences: AccessibilityPreferences): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Reduced motion
  if (preferences.reducedMotion) {
    root.style.setProperty('--animation-duration', '0.01ms');
    root.style.setProperty('--transition-duration', '0.01ms');
    root.classList.add('reduce-motion');
  } else {
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
    root.classList.remove('reduce-motion');
  }

  // High contrast
  if (preferences.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Large text
  if (preferences.largeText) {
    root.classList.add('large-text');
  } else {
    root.classList.remove('large-text');
  }

  // Focus visible
  if (preferences.focusVisible) {
    root.classList.add('focus-visible');
  } else {
    root.classList.remove('focus-visible');
  }
}

// ARIA utilities
/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Create ARIA relationship between elements
 */
export function createAriaRelationship(
  controller: HTMLElement,
  target: HTMLElement,
  relationship: 'labelledby' | 'describedby' | 'controls' | 'owns'
): void {
  const id = generateAriaId(relationship);
  target.id = id;

  const ariaAttr = `aria-${relationship}`;
  const currentValue = controller.getAttribute(ariaAttr);

  if (currentValue) {
    controller.setAttribute(ariaAttr, `${currentValue} ${id}`);
  } else {
    controller.setAttribute(ariaAttr, id);
  }
}

// Touch target utilities for WCAG 2.1 AA (44px minimum)
export interface TouchTargetInfo {
  element: HTMLElement;
  width: number;
  height: number;
  isCompliant: boolean;
  needsPadding: boolean;
}

/**
 * Check if an element meets minimum touch target size requirements
 */
export function checkTouchTargetCompliance(element: HTMLElement): TouchTargetInfo {
  const styles = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  // Account for padding and borders in calculations
  const width = rect.width;
  const height = rect.height;

  const MIN_SIZE = 44; // WCAG 2.1 AA requirement
  const isCompliant = width >= MIN_SIZE && height >= MIN_SIZE;
  const needsPadding = !isCompliant;

  return { element, width, height, isCompliant, needsPadding };
}

/**
 * Ensure element meets minimum touch target size
 */
export function ensureTouchTargetSize(element: HTMLElement, minSize = 44): void {
  const { width, height, isCompliant } = checkTouchTargetCompliance(element);

  if (!isCompliant) {
    const needsWidthPadding = width < minSize;
    const needsHeightPadding = height < minSize;

    if (needsWidthPadding || needsHeightPadding) {
      if (needsWidthPadding) {
        element.style.minWidth = `${minSize}px`;
      }
      if (needsHeightPadding) {
        element.style.minHeight = `${minSize}px`;
      }
      element.classList.add('touch-target-enhanced');
    }
  }
}

// Skip link utilities
export interface SkipLink {
  href: string;
  text: string;
  priority?: number;
}

/**
 * Create skip links for keyboard navigation
 */
export function createSkipLinks(links: SkipLink[]): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'skip-links';

  links
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .forEach(link => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.textContent = link.text;
      skipLink.className = 'skip-link';
      skipLink.setAttribute('aria-label', `Skip to ${link.text}`);

      container.appendChild(skipLink);
    });

  return container;
}

// Color scheme utilities for high contrast mode
export const HIGH_CONTRAST_COLORS = {
  // WCAG AAA compliant color combinations
  text: {
    primary: '#000000',
    secondary: '#333333',
    inverse: '#FFFFFF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    accent: '#E9ECEF',
  },
  interactive: {
    primary: '#0066CC',
    hover: '#004499',
    focus: '#0066CC',
    disabled: '#6C757D',
  },
  semantic: {
    success: '#28A745',
    warning: '#FFC107',
    danger: '#DC3545',
    info: '#17A2B8',
  },
  border: {
    default: '#DEE2E6',
    focus: '#0066CC',
  }
} as const;

// Initialize accessibility features on page load
export function initializeAccessibility(): void {
  if (typeof window === 'undefined') return;

  // Apply stored preferences
  const preferences = getAccessibilityPreferences();
  applyAccessibilityPreferences(preferences);

  // Enhance touch targets
  document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
    if (element instanceof HTMLElement) {
      ensureTouchTargetSize(element);
    }
  });

  // Add high contrast mode support
  if (preferences.highContrast) {
    document.documentElement.classList.add('high-contrast');
  }

  // Announce page load to screen readers
  setTimeout(() => {
    announceToScreenReader('Page loaded and ready for interaction', 'polite');
  }, 500);
}

// Export commonly used accessibility shortcuts
export const COMMON_KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'e',
    altKey: true,
    handler: () => {
      // Focus emergency contacts
      const emergencyButton = document.querySelector('[aria-label*="emergency" i]') as HTMLElement;
      emergencyButton?.focus();
      announceToScreenReader('Emergency contacts available', 'assertive');
    },
    description: 'Focus emergency contacts'
  },
  {
    key: 's',
    altKey: true,
    handler: () => {
      // Focus search
      const searchInput = document.querySelector('input[type="search"]') as HTMLElement;
      searchInput?.focus();
      announceToScreenReader('Search field focused', 'polite');
    },
    description: 'Focus search field'
  },
  {
    key: 'm',
    altKey: true,
    handler: () => {
      // Focus main content
      const mainContent = document.querySelector('main') as HTMLElement;
      mainContent?.focus();
      announceToScreenReader('Main content focused', 'polite');
    },
    description: 'Focus main content'
  },
  {
    key: 'n',
    altKey: true,
    handler: () => {
      // Focus navigation
      const navigation = document.querySelector('nav') as HTMLElement;
      navigation?.focus();
      announceToScreenReader('Navigation focused', 'polite');
    },
    description: 'Focus navigation menu'
  }
];

// Hook for React components
export function useAccessibility() {
  return {
    announceToScreenReader,
    createFocusTrap,
    manageModalFocus,
    checkWCAGCompliance,
    getAccessibilityPreferences,
    saveAccessibilityPreferences,
    ensureTouchTargetSize,
    registerKeyboardShortcuts,
    createScreenReaderAnnouncer,
    generateAriaId,
    createAriaRelationship,
    checkTouchTargetCompliance,
  };
}