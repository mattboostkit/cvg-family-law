"use client";

import { useEffect } from "react";

export interface WebVitalsMetric {
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
}

const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(value: number, metric: keyof typeof thresholds): "good" | "needs-improvement" | "poor" {
  const { good, poor } = thresholds[metric];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

function logMetric(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
  }

  // Send to analytics service (replace with your analytics provider)
  if (typeof window !== "undefined" && "gtag" in window) {
    const gtag = (window as typeof window & { gtag: (command: string, target: string, parameters: Record<string, unknown>) => void }).gtag;
    gtag("event", metric.name, {
      value: Math.round(metric.value),
      event_category: "Web Vitals",
      event_label: metric.rating,
      non_interaction: true,
    });
  }
}

export function WebVitalsTracker() {
  useEffect(() => {
    // TODO: Fix web-vitals integration once package API is confirmed
    // For now, we'll track basic performance metrics manually

    // Track basic navigation timing
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

      if (navigation) {
        const ttfb = navigation.responseStart - navigation.fetchStart;
        const fcp = navigation.responseEnd - navigation.fetchStart;

        logMetric({
          name: "TTFB",
          value: ttfb,
          rating: getRating(ttfb, "TTFB"),
          delta: 0,
        });

        logMetric({
          name: "FCP",
          value: fcp,
          rating: getRating(fcp, "FCP"),
          delta: 0,
        });
      }
    }
  }, []);

  return null;
}

// Performance budgets
export const performanceBudgets = {
  LCP: 2500, // < 2.5s
  FID: 100,  // < 100ms
  CLS: 0.1,  // < 0.1
  FCP: 1800, // < 1.8s
  TTFB: 800, // < 800ms
  bundleSize: 500 * 1024, // < 500KB
};

export function checkPerformanceBudget(metric: keyof typeof performanceBudgets, value: number): boolean {
  return value <= performanceBudgets[metric];
}