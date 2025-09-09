import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf9",
          100: "#ccfbea",
          200: "#99f5d6",
          300: "#5ee9bd",
          400: "#2dd49f",
          500: "#559E9C",
          600: "#4a8a89",
          700: "#3a6f6e",
          800: "#2a5453",
          900: "#1a3938",
        },
        secondary: {
          50: "#f0fdf9",
          100: "#ccfbea",
          200: "#99f5d6",
          300: "#5ee9bd",
          400: "#2dd49f",
          500: "#14b886",
          600: "#0d9668",
          700: "#0f7754",
          800: "#125e45",
          900: "#134d3a",
        },
        warmgray: {
          50: "#faf9f7",
          100: "#f3f2ee",
          200: "#e8e6de",
          300: "#d7d3c7",
          400: "#b8b2a2",
          500: "#9e9687",
          600: "#877b6a",
          700: "#706658",
          800: "#5e574c",
          900: "#514b42",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        accent: "#fbbf24",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-dm-sans)", "var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;