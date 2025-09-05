# Public Assets Directory

This directory contains all public assets for the CVG Family Law website.

## 📁 Directory Structure

```
public/
├── logos/          # Company logos and branding
├── images/         # General website images
├── icons/          # Icons and small graphics
├── favicon/        # Favicon files
└── *.svg           # Default Next.js icons (can be removed)
```

## 🎨 Logo Guidelines

### Logo Placement
Place your CVG Family Law logo files in the `logos/` directory:

**Recommended logo files:**
- `logo.svg` - Primary logo (vector format, scalable)
- `logo.png` - High-res PNG fallback (transparent background)
- `logo-white.svg` - White version for dark backgrounds
- `logo-horizontal.svg` - Horizontal layout version
- `logo-icon.svg` - Icon/symbol only version

### Logo Usage in Components
Your logo will be used in:
- **Header**: Main navigation logo
- **Footer**: Secondary branding
- **Favicon**: Browser tab icon
- **Social sharing**: Open Graph images

## 📐 Recommended Logo Specifications

### Primary Logo
- **Format**: SVG (preferred) or PNG
- **Background**: Transparent
- **Dimensions**: Minimum 200x200px for PNG
- **Colors**: Your brand colors with high contrast

### Favicon
- **Size**: 32x32px, 16x16px
- **Format**: ICO, PNG, or SVG
- **Placement**: `/public/favicon/`

## 🖼️ Image Guidelines

### General Images (`/images/`)
- **Format**: WebP (preferred), PNG, or JPG
- **Optimization**: Compress for web performance
- **Naming**: Use descriptive, hyphenated names

### Icons (`/icons/`)
- **Format**: SVG (preferred) for scalability
- **Size**: 24x24px standard, with larger variants
- **Style**: Consistent with your brand theme

## 📱 Usage Examples

### In React Components
```jsx
// Logo in header
<img src="/logos/logo.svg" alt="CVG Family Law" className="h-8" />

// General images
<img src="/images/team-photo.jpg" alt="CVG Family Law Team" />

// Icons
<img src="/icons/phone.svg" alt="" className="w-6 h-6" />
```

### In HTML/Meta Tags
```html
<!-- Favicon -->
<link rel="icon" href="/favicon/favicon.ico" />

<!-- Open Graph image -->
<meta property="og:image" content="/images/og-image.jpg" />
```

## 🚀 Next Steps

1. **Add Your Logo**: Upload your CVG Family Law logo to `/public/logos/`
2. **Update Components**: Replace placeholder logos in header and footer
3. **Add Favicon**: Create and add favicon files
4. **Optimize Images**: Ensure all images are web-optimized

## 📋 Current Assets Needed

- [ ] Primary company logo (SVG + PNG)
- [ ] White/dark version of logo
- [ ] Favicon files (multiple sizes)
- [ ] Open Graph sharing image
- [ ] Team photos (if applicable)
- [ ] Service-related imagery

---

*Upload your logo files to the appropriate directories and update the components to use them.*