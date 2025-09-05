# Logo Setup Guide for CVG Family Law

## 📁 Directory Structure Created

Your public assets are now organized as follows:

```
public/
├── logos/          # 👈 Upload your logo files here
│   ├── logo.svg         (Primary logo - recommended)
│   ├── logo.png         (PNG fallback)
│   ├── logo-white.svg   (White version for dark backgrounds)
│   └── logo-icon.svg    (Icon only version)
├── images/         # General website images
├── icons/          # Icons and small graphics
├── favicon/        # 👈 Upload favicon files here
│   ├── favicon.ico
│   ├── favicon-32x32.png
│   └── favicon-16x16.png
└── README.md       # Asset documentation
```

## 🎨 Logo Specifications Needed

### Primary Logo Files
Upload these files to `/public/logos/`:

1. **logo.svg** - Main company logo (SVG format preferred)
2. **logo.png** - PNG version (minimum 400x200px, transparent background)
3. **logo-white.svg** - White version for dark backgrounds
4. **logo-icon.svg** - Just the icon/symbol part (square format)

### Favicon Files
Upload these to `/public/favicon/`:

1. **favicon.ico** - 32x32px ICO format
2. **favicon-32x32.png** - 32x32px PNG
3. **favicon-16x16.png** - 16x16px PNG

## 🔧 Component Updates Needed

Once you upload your logo, here are the components that need updating:

### 1. Header Logo (EnhancedHeader.tsx)

**Current code** (lines 183-196):
```jsx
<Link href="/" className="flex items-center gap-3 group">
  <motion.div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
    <Shield className="h-7 w-7 text-white" />
  </motion.div>
  <div>
    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
      CVG Family Law
    </h1>
    <p className="text-xs text-gray-600">Compassionate Legal Support</p>
  </div>
</Link>
```

**Updated code** (after logo upload):
```jsx
<Link href="/" className="flex items-center gap-3 group">
  <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
    <img 
      src="/logos/logo.svg" 
      alt="CVG Family Law" 
      className="h-12 w-auto"
    />
  </motion.div>
  <div>
    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
      CVG Family Law
    </h1>
    <p className="text-xs text-gray-600">Compassionate Legal Support</p>
  </div>
</Link>
```

### 2. Footer Logo (Footer.tsx)

**Current code** (around line 50):
```jsx
<h3 className="text-lg font-bold mb-4">CVG Family Law</h3>
```

**Updated code**:
```jsx
<div className="flex items-center gap-2 mb-4">
  <img 
    src="/logos/logo-white.svg" 
    alt="CVG Family Law" 
    className="h-8 w-auto"
  />
  <h3 className="text-lg font-bold">CVG Family Law</h3>
</div>
```

### 3. Favicon Update (app/layout.tsx)

Add to the `<head>` section:
```jsx
<link rel="icon" href="/favicon/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
```

## 📋 Step-by-Step Upload Instructions

### Step 1: Upload Your Logo Files
1. Copy your logo files to the appropriate directories:
   ```bash
   # Example using Windows file explorer or WSL
   cp your-logo.svg /mnt/c/Dev/Cascade/cvgnext/public/logos/logo.svg
   cp your-logo.png /mnt/c/Dev/Cascade/cvgnext/public/logos/logo.png
   ```

2. Or drag and drop files directly into:
   - `public/logos/` - for logo files
   - `public/favicon/` - for favicon files

### Step 2: Test Logo Display
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000 to see the current Shield icon

3. After uploading, the logo should appear in the browser

### Step 3: Update Components (Optional - I can do this for you)
Once you've uploaded your logo files, let me know and I can:
- Update the header component to use your actual logo
- Update the footer with your branding
- Add proper favicon links
- Optimize the logo display for different screen sizes

## 🎯 Logo Design Recommendations

### For Best Results:
- **SVG format**: Scalable for all screen sizes
- **Transparent background**: Works on any background color
- **Horizontal layout**: Works well in the header navigation
- **High contrast**: Readable at small sizes
- **Brand colors**: Match your company palette (#ed6415 primary, #14b886 secondary)

### Logo Dimensions:
- **Header logo**: Should work well at 48px height
- **Footer logo**: Should work well at 32px height
- **Favicon**: 32x32px and 16x16px versions needed

## 🚨 Quick Start

**Fastest way to get your logo working:**

1. **Upload one file**: `logo.svg` to `/public/logos/`
2. **Tell me when done** - I'll update the components immediately
3. **View the result** at http://localhost:3000

That's it! Your professional logo will replace the current Shield icon.

---

## 📞 Need Help?

If you need assistance with:
- Logo file format conversion
- Updating the components
- Testing the logo display
- Creating favicons from your logo

Just let me know and I'll help you through the process!

---

*Ready when you are - upload your logo and I'll integrate it into the site for you.*