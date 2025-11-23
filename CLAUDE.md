# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "La Guía de Chile" frontend - a Next.js 16 application built with TypeScript, React 19, and Tailwind CSS 4. The project uses the Next.js App Router architecture with server components as the default.

## Development Commands

### Running the Application
- `npm run dev` - Start the development server (runs on http://localhost:3000)
- `npm run build` - Create a production build
- `npm start` - Run the production build locally

### Code Quality
- `npm run lint` - Run ESLint to check for code quality issues

## Tech Stack & Architecture

### Core Technologies
- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.0
- **TypeScript**: Version 5
- **Styling**: Tailwind CSS 4 with PostCSS, using the new CSS-based configuration
- **UI Components**: shadcn/ui (configured with "new-york" style)
- **Icons**: Lucide React and React Icons
- **Animations**: Framer Motion and tw-animate-css
- **Utilities**: Class Variance Authority (cva), clsx, tailwind-merge

### Key Configuration Details

**Path Aliases** (tsconfig.json):
- `@/*` maps to the root directory
- shadcn/ui configured with specific aliases:
  - `@/components` - React components
  - `@/components/ui` - shadcn/ui components
  - `@/lib` - Utility libraries
  - `@/hooks` - Custom React hooks

**Styling Architecture**:
- Tailwind CSS 4 using `@import "tailwindcss"` in app/globals.css
- Custom design system using OKLCH color space for better color perception
- Dark mode support via `.dark` class with `@custom-variant dark (&:is(.dark *))`
- Design tokens defined in `@theme inline` block and CSS custom properties
- `cn()` utility in lib/utils.ts for merging Tailwind classes (combines clsx and tailwind-merge)
- Animation utilities from tw-animate-css imported globally

**shadcn/ui Setup** (components.json):
- Style: "new-york"
- RSC (React Server Components): enabled
- Base color: neutral
- CSS variables: enabled
- Icon library: lucide

**Fonts**:
- Using next/font with Mulish (primary) and Open Sans (secondary)
- Font variables: `--font-mulish` and `--font-open-sans`
- Configured in app/layout.tsx with `display: "swap"` for optimal loading

### Project Structure

```
app/
  layout.tsx           - Root layout with Mulish/Open Sans fonts and metadata
  page.tsx             - Home page
  en-construccion/     - Construction page route
  globals.css          - Tailwind CSS imports, @theme inline, and design system tokens
  icon.tsx             - Dynamic favicon generator
  apple-icon.tsx       - Apple touch icon generator

lib/
  utils.ts             - Utility functions (cn for className merging)

components/            - React components following Atomic Design methodology
  atoms/               - Basic UI elements (button, input, icon, badge, avatar, ldc-logo)
  molecules/           - Simple combinations (search-bar, category-card, rating-stars, social-links, ldc-card-with-icon-and-tooltip)
  organisms/           - Complex functional components (header, footer, business-card, filter-panel)
  templates/           - Page layouts (main-layout, search-layout, business-detail-layout)
  pages/               - Complete page components (home-page, search-page, business-detail-page)
  ui/                  - shadcn/ui components (auto-generated, currently: tooltip)
  shared/              - Shared utilities (providers, error-boundary)
```

## Working with UI Components

### shadcn/ui Components
When adding shadcn/ui components, use the standard shadcn CLI:
```bash
npx shadcn@latest add [component-name]
```

Components will be added to `components/ui/` and can be imported using the `@/components/ui` alias.

### Animations
- **Framer Motion** is available for complex, interactive animations
- **tw-animate-css** provides Tailwind utility classes for common CSS animations
- Both libraries are imported globally and ready to use

## Styling Guidelines

- This project uses Tailwind CSS 4 with a custom design system
- Color definitions use OKLCH color space for better perceptual uniformity
- Dark mode is implemented via CSS custom properties that change with the `.dark` class
- Use the `cn()` utility from `@/lib/utils` to merge conditional classes
- The design system includes predefined tokens for: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, charts (1-5), and sidebar variants

**Custom Brand Colors** (available as Tailwind utilities):
- `yellow` - #ffbe0b (oklch(0.82 0.15 85))
- `orange` - #fd9809 (oklch(0.75 0.18 55))
- `orange-red` - #fb5607 (oklch(0.68 0.22 35))
- `pink` - #ff006e (oklch(0.62 0.28 350))
- `purple` - #8338ec (oklch(0.58 0.24 290))
- `blue-gray` - #7783a9 (oklch(0.57 0.06 255))

Use as: `bg-yellow`, `text-orange`, `border-pink`, etc.

## Component Structure (Atomic Design)

All components follow Atomic Design methodology with kebab-case naming:

**Atoms**: Basic, indivisible elements
- Example: `components/atoms/button/button.tsx`
- Import: `import { Button } from "@/components/atoms/button"`

**Molecules**: Simple combinations of atoms
- Example: `components/molecules/search-bar/search-bar.tsx`
- Import: `import { SearchBar } from "@/components/molecules/search-bar"`

**Organisms**: Complex functional components
- Example: `components/organisms/header/header.tsx`
- Import: `import { Header } from "@/components/organisms/header"`

**Templates**: Page layouts
- Example: `components/templates/main-layout/main-layout.tsx`
- Import: `import { MainLayout } from "@/components/templates/main-layout"`

**Pages**: Complete page components
- Example: `components/pages/home-page/home-page.tsx`
- Import: `import { HomePage } from "@/components/pages/home-page"`
- Used by Next.js routes in `/app`

**Component File Structure**:
```
component-name/
├── component-name.tsx    # Component implementation
├── index.ts             # Barrel export
```

## Code Conventions

- Use TypeScript for all new files
- Follow Next.js App Router conventions (Server Components by default)
- Use the `@/` path alias for imports
- Component files and directories use **kebab-case** naming
- Component exports use PascalCase
- ESLint is configured with Next.js recommended rules for TypeScript

### **CRITICAL: Component Naming Pattern**
**All custom components MUST use the `LDC` prefix** (La Guía de Chile brand identifier):
- ✅ Correct: `LDCHeader`, `LDCFooter`, `LDCButton`, `LDCCard`, `LDCLogo`
- ❌ Incorrect: `Header`, `Footer`, `Button`, `Card`, `Logo`

**Exceptions:**
- shadcn/ui components in `components/ui/` (auto-generated, no LDC prefix)
- Third-party library components
- Native HTML elements

**Examples:**
```typescript
// Custom components - ALWAYS use LDC prefix
export function LDCHeader() { ... }
export function LDCSearchBar() { ... }
export function LDCBusinessCard() { ... }

// File structure
components/organisms/ldc-header/ldc-header.tsx  // kebab-case file
export { LDCHeader } from "./ldc-header"        // PascalCase export
```

## Special Features

### Dynamic Favicon System
The project includes dynamic favicon generation:
- `app/icon.tsx` - Generates PNG favicons using the LDCLogo isotipo
- `app/apple-icon.tsx` - Generates Apple touch icons
- Metadata configured in `app/layout.tsx` with both SVG and PNG icon support

### Metadata Configuration
Site metadata is centralized in `app/layout.tsx`:
- Title: "La Guía de Chile"
- Description: "Descubre los mejores lugares, servicios y negocios de Chile"
- Multiple icon formats for cross-platform compatibility
