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

### Key Configuration Details

**Path Aliases** (tsconfig.json):
- `@/*` maps to the root directory
- shadcn/ui configured with specific aliases:
  - `@/components` - React components
  - `@/components/ui` - shadcn/ui components
  - `@/lib` - Utility libraries
  - `@/hooks` - Custom React hooks

**Styling Architecture**:
- Tailwind CSS 4 using CSS imports in app/globals.css
- Custom design system using OKLCH color space
- Dark mode support via `.dark` class
- Design tokens defined in CSS custom properties
- `cn()` utility in lib/utils.ts for merging Tailwind classes (combines clsx and tailwind-merge)

**shadcn/ui Setup** (components.json):
- Style: "new-york"
- RSC (React Server Components): enabled
- Base color: neutral
- CSS variables: enabled
- Icon library: lucide

**Fonts**:
- Using next/font with Geist Sans and Geist Mono
- Font variables: `--font-geist-sans` and `--font-geist-mono`

### Project Structure

```
app/
  layout.tsx    - Root layout with font setup and metadata
  page.tsx      - Home page (currently using Next.js starter template)
  globals.css   - Tailwind CSS imports and design system tokens

lib/
  utils.ts      - Utility functions (cn for className merging)

components/     - React components following Atomic Design methodology
  atoms/        - Basic, indivisible UI elements (button, input, icon, badge, avatar, logo)
  molecules/    - Simple combinations of atoms (search-bar, category-card, rating-stars)
  organisms/    - Complex functional components (header, footer, business-card, filter-panel)
  templates/    - Page layouts (main-layout, search-layout, business-detail-layout)
  pages/        - Complete page components (home-page, search-page, business-detail-page)
  ui/           - shadcn/ui components (auto-generated)
  shared/       - Shared utilities (providers, error-boundary)
```

## Working with UI Components

When adding shadcn/ui components, use the standard shadcn CLI:
```bash
npx shadcn@latest add [component-name]
```

Components will be added to `components/ui/` and can be imported using the `@/components/ui` alias.

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
