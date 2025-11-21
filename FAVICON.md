# Favicon Implementation

## Overview

The favicon for "La Guía de Chile" is based on the isotipo (icon part) of the LDCLogo component. It features:

- **Pink background** (#ff006e) - Brand color
- **Orange decorative circles** (#fd9809) - Creating a "lava lamp" effect (static version)
- **White map pin icon** - Representing location/guide functionality

## Files

The favicon implementation consists of three files in the `/app` directory:

### 1. `/app/icon.svg` (Recommended)

Static SVG version of the favicon with the best quality and scalability.

- **Format**: SVG
- **Size**: 32x32 viewBox
- **Advantages**:
  - Scalable to any size without quality loss
  - Smallest file size
  - Best for modern browsers
  - Supports all visual effects (blur, shadows)

### 2. `/app/icon.tsx` (Programmatic)

Dynamically generated PNG icon using Next.js ImageResponse API.

- **Format**: PNG (32x32px)
- **Generated at**: Build time (statically optimized)
- **Technology**: Satori (Next.js OG image generation)
- **Note**: Uses simplified design due to Satori limitations (no blur filters)

### 3. `/app/apple-icon.tsx` (iOS)

High-resolution icon for iOS home screens and bookmarks.

- **Format**: PNG (180x180px)
- **Purpose**: Apple Touch Icon
- **Generated at**: Build time (statically optimized)
- **Styling**: iOS app icon style with 22.5% border radius

## Implementation Details

### Next.js Auto-Detection

Next.js 15/16 automatically detects and serves these icon files:

- `icon.svg` → `/icon.svg`
- `icon.tsx` → `/icon` (PNG output)
- `apple-icon.tsx` → `/apple-icon` (PNG output)

### Metadata Configuration

The icons are explicitly configured in `/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "La Guía de Chile",
  description: "Descubre los mejores lugares, servicios y negocios de Chile",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-icon",
  },
};
```

This generates the following HTML tags:

```html
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="icon" href="/icon" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-icon">
```

## Color Palette

The favicon uses colors from the brand palette defined in `/app/globals.css`:

- **Pink**: `#ff006e` (oklch(0.62 0.28 350))
- **Orange**: `#fd9809` (oklch(0.75 0.18 55))
- **White**: `#ffffff` (for the map pin icon)

## Design Constraints

### Satori Limitations (icon.tsx & apple-icon.tsx)

The ImageResponse API uses Satori for rendering, which has limitations:

- **No blur filters**: Cannot use `filter: blur()` for the lava lamp effect
- **Limited CSS**: Only supports Flexbox layout (no Grid)
- **No complex gradients**: Radial gradients are not fully supported
- **Solution**: Used solid circles with opacity to create a similar visual effect

### SVG Version (icon.svg)

The SVG version doesn't have these limitations and includes:

- Actual blur effects for the orange circles
- Drop shadows for the map pin
- Full visual fidelity to the original design

## Browser Support

| Browser | SVG Support | PNG Fallback |
|---------|-------------|--------------|
| Modern browsers (Chrome, Firefox, Safari, Edge) | ✅ icon.svg | ✅ icon |
| Older browsers | ❌ | ✅ icon |
| iOS Safari | ✅ icon.svg | ✅ apple-icon |
| Android Chrome | ✅ icon.svg | ✅ icon |

## Testing

### Development

```bash
npm run dev
```

Visit: http://localhost:3000

Check the browser tab for the favicon.

### Production Build

```bash
npm run build
npm start
```

The icons are generated at build time and served as static files.

### Verify Icon Routes

- SVG: http://localhost:3000/icon.svg
- PNG 32x32: http://localhost:3000/icon
- Apple 180x180: http://localhost:3000/apple-icon

## Cache Busting

If you update the favicon and don't see changes:

1. **Hard refresh**:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache**

3. **Rebuild the project**: `npm run build`

## Future Improvements

Potential enhancements:

1. **Additional sizes**: Add more icon sizes for different platforms
2. **Web App Manifest**: Add `manifest.json` for PWA support
3. **Browser config**: Add `browserconfig.xml` for Windows tiles
4. **Animated version**: Consider an animated SVG for special occasions (use sparingly for performance)

## References

- [Next.js App Icons Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [Next.js ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Satori Documentation](https://github.com/vercel/satori)
- [LDCLogo Component](/components/atoms/ldc-logo/ldc-logo.tsx)
