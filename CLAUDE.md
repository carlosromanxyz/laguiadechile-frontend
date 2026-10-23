# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "La Guía de Chile" frontend - a Next.js 16 application built with TypeScript, React 19, and Tailwind CSS 4. The project uses the Next.js App Router architecture with server components as the default.

## Development Commands

### Native (Node 20+ required)

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm start        # Run production build locally
npm run lint     # Run ESLint
```

### Containerized (recommended — no local Node needed)

Run from the repo root (`/laguiadechile/`):

```bash
docker compose up -d                 # Build & start (first run takes ~1-2 min)
docker compose logs -f frontend      # Follow logs
docker compose down                  # Stop & remove containers
docker compose down -v               # Full reset (also clears volumes)
```

Default host port is **3013** (http://localhost:3013) to avoid conflict with other local projects on 3000. Override via env vars: `FRONTEND_PORT=4000 UNDER_CONSTRUCTION=false docker compose up -d`.

No test framework is currently configured.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.0
- **TypeScript**: Version 5
- **Styling**: Tailwind CSS 4 with CSS-based configuration (`@theme inline` in globals.css)
- **UI Components**: shadcn/ui (new-york style, RSC enabled)
- **Icons**: Lucide React and React Icons
- **Animations**: Framer Motion and tw-animate-css
- **Carousel**: Embla Carousel
- **Forms**: React Hook Form with Zod validation
- **Utilities**: clsx, tailwind-merge, Class Variance Authority (cva)

## Architecture

### Route Structure (App Router with Route Groups)

```
app/
├── (main)/              # Main site route group
│   ├── layout.tsx       # Shared layout with header/footer
│   └── page.tsx         # Homepage
├── en-construccion/     # Construction/maintenance page
├── api/                 # API route handlers
│   ├── weather/         # Open-Meteo weather proxy
│   ├── pharmacies/      # Pharmacy data
│   └── wikipedia/       # Wikipedia city info proxy
├── globals.css          # Tailwind theme & CSS variables
└── layout.tsx           # Root layout with fonts & providers
```

### Data Flow Pattern

```
data/*.json → services/*.ts → interfaces/*.ts → components/
```

- **data/**: Static JSON files (categories, cities, listings, news, etc.)
- **services/**: Data fetching functions that read from JSON or external APIs
- **interfaces/**: TypeScript interfaces prefixed with `I` (e.g., `IFeaturedCategory`, `ICity`)
- **config/**: App configuration (`navigation.ts`, `social-networks.ts`)
- **validations/**: Zod schemas for form validation

### Component Architecture (Atomic Design)

```
components/
├── atoms/           # Primitivas (ldc-logo, ldc-badge, ldc-section, ldc-load-more-button)
├── molecules/       # Combinaciones de átomos (ldc-category-card, ldc-combobox)
├── organisms/       # Secciones, formularios y widgets (ldc-header, ldc-search-form, ldc-login-form)
├── templates/       # Esqueletos de página sin datos (ldc-coming-soon-template)
├── pages/           # Complete page components
├── ui/              # shadcn/ui components (auto-generated, NO LDC prefix)
└── shared/          # Providers, utilities (theme-provider)
```

**Matriz de imports** (`no-restricted-imports` por carpeta en `eslint.config.mjs`; hoy en `warn`):

| Nivel | Puede importar | No puede importar |
|---|---|---|
| `atoms/` (y `ui/`, que cuenta como átomo) | `ui`, `lib`, `interfaces` y otros átomos | molecules, organisms, templates |
| `molecules/` | atoms, `ui` y otras moléculas | organisms, templates |
| `organisms/` | organisms, molecules, atoms, `ui` | templates |
| `templates/` | todo (sin pedir datos) | — |

Los imports dentro del mismo nivel están permitidos. Imports siempre absolutos, `@/components/<nivel>/<nombre>` (sin barrels por nivel).

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
- Colors defined with OKLCH color space in `globals.css`
- Dark mode via `.dark` class and CSS custom properties
- Brand colors: `yellow`, `orange`, `orange-red`, `pink`, `purple`, `blue-gray`

### Fonts
- Primary: Mulish (`--font-mulish`, `font-mulish`) - default body font
- Secondary: Open Sans (`--font-open-sans`)

## Environment Variables

```bash
UNDER_CONSTRUCTION=true  # Redirects all traffic to /en-construccion
```

Locally lives in `.env.local`. With docker-compose, override at the repo root: `UNDER_CONSTRUCTION=false docker compose up`.

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components are added to `components/ui/` with no LDC prefix.

## Path Aliases

- `@/*` → root directory
- `@/components`, `@/components/ui`, `@/lib`, `@/hooks`
