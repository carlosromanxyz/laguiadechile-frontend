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

components/     - Planned directory for React components
  ui/          - shadcn/ui components go here
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

## Code Conventions

- Use TypeScript for all new files
- Follow Next.js App Router conventions (Server Components by default)
- Use the `@/` path alias for imports
- Component files use `.tsx` extension
- ESLint is configured with Next.js recommended rules for TypeScript
