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
├── (main)/              # Sitio público (layout con header/footer); páginas = DAL + template
├── (auth)/dashboard/    # Login del dashboard (route group sin el layout protegido)
├── (dashboard)/dashboard/ # Dashboard admin (layout con auth)
├── en-construccion/     # Página de mantenimiento (UNDER_CONSTRUCTION=true)
├── api/                 # Route handlers: proxies a la API (listings, news…), auth, y
│                        # weather, pharmacies y wikipedia vía lib/external
├── globals.css          # Tema de Tailwind y variables CSS
└── layout.tsx           # Layout raíz con fuentes y providers
```

### Data Flow Pattern

```
NestJS API → lib/api/* (DAL, server-only) → app/**/page.tsx → components/templates → organisms/molecules/atoms
```

- **lib/api/**: DAL `server-only` sobre la API de NestJS (`server-fetch.ts`, `mappers.ts`). Ningún client component la importa.
- **lib/external/**: clientes de servicios externos (clima, farmacias, Wikipedia), `server-only`; solo los usan los route handlers de `app/api/*`.
- **lib/format/**: helpers puros (sin I/O ni React), seguros en server y client.
- **hooks/**: hooks de cliente (`use-city-weather`, `use-on-duty-pharmacy`, `use-is-mobile`…).
- **interfaces/**: tipos TypeScript con prefijo `I` (`ICity`, `IListingDetail`). Los tipos que usa un client component van aquí, nunca en `lib/api` (los `Raw*` de la API se quedan en `lib/api/mappers.ts`).
- **services/**: shims que reexportan la DAL (salvo `services/admin/*`, server-only del dashboard); no agregues lógica nueva ahí, importa de `lib/api/*`.
- **config/**: configuración de la app (`navigation.ts`, `social-networks.ts`).
- **validations/**: schemas Zod de formularios.

### Component Architecture (Atomic Design)

```
components/
├── atoms/       # Primitivas (ldc-logo, ldc-badge, ldc-avatar)
├── molecules/   # Combinaciones de átomos (ldc-category-card, ldc-combobox)
├── organisms/   # Secciones, formularios y widgets (ldc-header, ldc-search-form)
├── templates/   # Esqueletos de página sin datos (ldc-home-template, ldc-detail-template)
├── ui/          # shadcn/ui (generado, sin prefijo LDC; cuenta como átomo)
└── shared/      # Providers (theme-provider)
```

**Matriz de imports**, aplicada en `error` por `no-restricted-imports` por carpeta en `eslint.config.mjs` (un import prohibido rompe el lint):

| Nivel | Puede importar | No puede importar |
|---|---|---|
| `atoms/` y `ui/` | `ui`, `lib`, `interfaces` y otros átomos | molecules, organisms, templates |
| `molecules/` | atoms, `ui` y otras moléculas | organisms, templates |
| `organisms/` | organisms, molecules, atoms y `ui` | templates |
| `templates/` | todo | — |

**Templates y páginas:**
- Los templates son siempre Server Components y no tienen datos: no hacen fetch, reciben todo por props.
- Las páginas (`app/**/page.tsx`) solo piden datos a la DAL (`lib/api/*`) y se los pasan a un template.
- `app/**/_components/` es solo para contenedores cliente de datos (p. ej. `ciudad/[slug]/_components/`, que usan los hooks de clima y farmacia y pasan props a organismos presentacionales).

**Imports:** siempre absolutos y a la carpeta del componente, nunca al archivo interno ni con barrels por nivel:

```ts
import { LDCHeader } from "@/components/organisms/ldc-header";          // bien
import { LDCHeader } from "@/components/organisms/ldc-header/ldc-header"; // mal
```

**Estructura de cada componente:**
```
ldc-component-name/
├── ldc-component-name.tsx
└── index.ts          # export { LDCComponentName } from "./ldc-component-name";
```

**RSC:** los íconos Lucide no cruzan de Server a Client: pasa el JSX ya renderizado o el nombre con `lib/get-icon`, o marca el padre `"use client"`. No quites `"use client"` donde se formatean fechas sin `timeZone`, ni donde se usa `useIsMobile` o el tema (hidratación).

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
