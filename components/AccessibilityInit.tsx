"use client";

import { useEffect } from 'react';
import { initializeAccessibility } from '@/lib/accessibility';

export default function AccessibilityInit() {
  useEffect(() => {
    initializeAccessibility();
  }, []);

  return null;
}