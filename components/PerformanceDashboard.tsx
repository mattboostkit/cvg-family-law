"use client";

import { useState, useEffect } from "react";
import { performanceBudgets, checkPerformanceBudget } from "@/lib/web-vitals";

interface PerformanceMetric {
  name: string;
  value: number;
  budget: number;
  status: "good" | "needs-improvement" | "poor";
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get performance metrics from Navigation Timing API
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

      if (navigation) {
        const perfMetrics: PerformanceMetric[] = [
          {
            name: "LCP",
            value: 0, // Will be updated by Web Vitals
            budget: performanceBudgets.LCP,
            status: "good",
          },
          {
            name: "FID",
            value: 0, // Will be updated by Web Vitals
            budget: performanceBudgets.FID,
            status: "good",
          },
          {
            name: "CLS",
            value: 0, // Will be updated by Web Vitals
            budget: performanceBudgets.CLS,
            status: "good",
          },
          {
            name: "FCP",
            value: navigation.responseEnd - navigation.fetchStart,
            budget: performanceBudgets.FCP,
            status: checkPerformanceBudget("FCP", navigation.responseEnd - navigation.fetchStart) ? "good" : "poor",
          },
          {
            name: "TTFB",
            value: navigation.responseStart - navigation.fetchStart,
            budget: performanceBudgets.TTFB,
            status: checkPerformanceBudget("TTFB", navigation.responseStart - navigation.fetchStart) ? "good" : "poor",
          },
        ];

        setMetrics(perfMetrics);
      }
    }
  }, []);

  // Listen for Web Vitals updates
  useEffect(() => {
    const handleWebVitalsUpdate = (event: CustomEvent) => {
      const { name, value } = event.detail;
      setMetrics(prev =>
        prev.map(metric =>
          metric.name === name
            ? {
                ...metric,
                value,
                status: checkPerformanceBudget(name.toLowerCase() as keyof typeof performanceBudgets, value) ? "good" : "poor"
              }
            : metric
        )
      );
    };

    window.addEventListener("web-vitals-update", handleWebVitalsUpdate as EventListener);
    return () => window.removeEventListener("web-vitals-update", handleWebVitalsUpdate as EventListener);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="View Performance Metrics"
      >
        📊
      </button>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600 bg-green-50";
      case "needs-improvement": return "text-yellow-600 bg-yellow-50";
      case "poor": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-2xl p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Performance Dashboard</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex justify-between items-center text-sm">
            <span className="font-medium">{metric.name}</span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(metric.status)}`}>
                {metric.value > 0 ? `${Math.round(metric.value)}ms` : "Loading..."}
              </span>
              <span className="text-gray-400">
                / {metric.budget}{metric.name === "CLS" ? "" : "ms"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="text-xs text-gray-600">
          <p><strong>Core Web Vitals Targets:</strong></p>
          <p>LCP {"<"} 2.5s, FID {"<"} 100ms, CLS {"<"} 0.1</p>
        </div>
      </div>
    </div>
  );
}