# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CVG Family Law website - a warm, compassionate family law firm website built with Next.js 15, TypeScript, and Tailwind CSS. The site serves vulnerable individuals seeking legal support for family matters including domestic abuse, divorce, children law, and financial settlements.

## Key Commands

```bash
# Development
npm run dev          # Start development server with Turbopack on http://localhost:3000
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint

# Git workflow
git add -A
git commit -m "message"
git push origin main

# Deployment
# Auto-deploys to Vercel on push to main branch
# Repository: https://github.com/mattboostkit/cvg-family-law
```

## Architecture & Structure

### Tech Stack
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS v3** for styling (downgraded from v4 for stability)
- **Framer Motion** for animations
- **Lucide React** for icons
- **Google Fonts**: DM Sans (headers), Inter (body)

### Key Directories
- `/app` - Next.js app router pages and layouts
  - Each service has its own page under `/services`
  - Legal pages: `/privacy`, `/legal`
- `/components` - Reusable React components
  - `/layout` - Header, Footer
  - `/sections` - Page sections (Hero, Services, Support Resources, etc.)
- `/lib` - Utilities and constants
  - `constants.ts` - Site config, navigation, services (SRA No: 8007597, Company No: 15007102)
  - `types.ts` - TypeScript type definitions
  - `utils.ts` - Utility functions including `cn()` for className merging

### Design System
- **Colors**: Warm palette with orange/terracotta primary (#ed6415), teal secondary (#14b886)
- **Typography**: DM Sans Semi-Bold for headers, Inter for body text
- **Components**: All buttons use `btn-primary`, `btn-secondary`, or `btn-outline` classes
- **Spacing**: Uses `section-padding` and `container-main` for consistent layout

### Important Business Details
- **Phone**: 07984 782 713
- **Email**: contact@cvgfamilylaw.com
- **Address**: 89 High Street, Tunbridge Wells, Kent, TN1 1YG
- **SRA Number**: 8007597
- **Company Number**: 15007102

### Development Notes
- Site emphasizes warmth, compassion, and family-oriented messaging
- Image placeholders used throughout for visual warmth
- Support resources section includes comprehensive emergency contacts
- Free 30-minute consultation prominently featured
- Emergency banner for domestic abuse victims (999 for immediate danger)

### Common Tasks
- When updating content, check `/lib/constants.ts` for centralized business information
- For styling changes, use Tailwind classes and check `tailwind.config.ts` for custom theme
- All headings automatically use DM Sans Semi-Bold via global CSS
- Use Framer Motion for animations (components already set up with motion)

### Deployment
- Automatically deploys to Vercel on push to main branch
- Ensure no ESLint errors before committing (Vercel build will fail)
- Common ESLint fixes: use HTML entities for apostrophes (&apos;), remove unused imports