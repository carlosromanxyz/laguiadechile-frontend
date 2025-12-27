# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "La Guía de Chile" frontend - a Next.js 16 application built with TypeScript, React 19, and Tailwind CSS 4. The project uses the Next.js App Router architecture with server components as the default.

## Development Commands

- `npm run dev` - Start the development server (runs on http://localhost:3000)
- `npm run build` - Create a production build
- `npm start` - Run the production build locally
- `npm run lint` - Run ESLint to check for code quality issues

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.0
- **TypeScript**: Version 5
- **Styling**: Tailwind CSS 4 with CSS-based configuration (`@theme inline` in globals.css)
- **UI Components**: shadcn/ui (new-york style, RSC enabled)
- **Icons**: Lucide React and React Icons
- **Animations**: Framer Motion and tw-animate-css
- **Forms**: React Hook Form with Zod validation
- **Utilities**: clsx, tailwind-merge, Class Variance Authority (cva)

## Architecture

### Data Flow Pattern

```
data/*.json → services/*.ts → interfaces/*.ts → components/
```

- **data/**: Static JSON files (categories, cities, listings, news, etc.)
- **services/**: Data fetching functions that read from JSON or external APIs
- **interfaces/**: TypeScript interfaces prefixed with `I` (e.g., `IFeaturedCategory`)
- **config/**: App configuration (navigation items, social networks)
- **validations/**: Zod schemas for form validation

### API Routes

Route handlers in `app/api/` proxy external APIs:
- `/api/weather?city=Santiago` - Weather data from Open-Meteo
- `/api/pharmacies` - Pharmacy data

### Component Architecture (Atomic Design)

```
components/
├── atoms/           # Basic elements (ldc-logo, ldc-badge, ldc-button)
├── molecules/       # Combinations (ldc-search-form, ldc-category-card)
├── organisms/       # Complex components (ldc-header, ldc-footer, ldc-hero)
├── templates/       # Page layouts
├── pages/           # Complete page components
├── ui/              # shadcn/ui components (auto-generated)
└── shared/          # Providers, utilities (theme-provider)
```

**Component file structure:**
```
ldc-component-name/
├── ldc-component-name.tsx
└── index.ts          # Barrel export
```

## Critical Conventions

### Component Naming (REQUIRED)
**All custom components MUST use the `LDC` prefix:**
- Files: `components/organisms/ldc-header/ldc-header.tsx` (kebab-case)
- Exports: `export function LDCHeader() { ... }` (PascalCase)
- Imports: `import { LDCHeader } from "@/components/organisms/ldc-header"`

**Exceptions:** shadcn/ui components in `components/ui/`, third-party components

### Styling
- Use `cn()` from `@/lib/utils` for conditional classes
- Colors use OKLCH color space
- Dark mode via `.dark` class and CSS custom properties
- Brand colors: `yellow`, `orange`, `orange-red`, `pink`, `purple`, `blue-gray`

### Fonts
- Primary: Mulish (`--font-mulish`, `font-mulish`)
- Secondary: Open Sans (`--font-open-sans`)

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components are added to `components/ui/` with no LDC prefix.

## Path Aliases

- `@/*` → root directory
- `@/components`, `@/components/ui`, `@/lib`, `@/hooks`
