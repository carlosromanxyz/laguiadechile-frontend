This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Estructura de componentes

Los componentes siguen Atomic Design en `components/`. Cada carpeta tiene un README con la lista
de lo que contiene y qué puede importar:

- [`atoms/`](components/atoms/README.md): piezas mínimas; importan solo `ui`, `lib`, `interfaces` y otros atoms.
- [`molecules/`](components/molecules/README.md): combinaciones de atoms y `ui`; importan atoms, `ui` y otras molecules.
- [`organisms/`](components/organisms/README.md): secciones completas; importan organisms, molecules y atoms.
- [`templates/`](components/templates/README.md): esqueletos de página; importan todo, pero sin datos (reciben props, siempre Server Components).
- [`ui/`](components/ui/README.md): shadcn/ui sin prefijo; cuentan como átomos.
- [`shared/`](components/shared/README.md): providers globales (tema).

Los componentes propios llevan el prefijo LDC en la carpeta, el archivo y el export
(`ldc-x/ldc-x.tsx` → `LDCX`) y se importan por la carpeta: `@/components/<nivel>/ldc-x`. Los datos
se piden en las páginas de `app/` con la DAL de `lib/api/*` y bajan por props.

## Pruebas e2e (Playwright)

La suite vive en `tests/e2e/` (config en `playwright.config.ts`) y se corre a mano, sin CI ni
hooks, con `scripts/e2e.sh` desde el host. El script levanta la imagen
`mcr.microsoft.com/playwright:v1.64.0-noble` (trae Chromium; no se descarga nada en el host) en la
red del contenedor del front, donde `localhost:3000` es el dev server y `mailpit:8025` es la API de
Mailpit, con el repo montado en solo lectura.

```bash
scripts/e2e.sh                        # pruebas del front principal contra el stack
scripts/e2e.sh -g "bienvenida"        # el resto de los argumentos van a `playwright test`
scripts/e2e.sh --en CLGDC-N           # pruebas del worktree .worktrees/frontend-CLGDC-N
E2E_NODE_MODULES=<volumen> scripts/e2e.sh   # otro volumen de node_modules con @playwright/test
```

- Necesita el stack arriba (front, backend, Mailpit y base) y `@playwright/test@1.64.0` en el
  volumen de `node_modules` del front (`npm install` en el contenedor). Con `--en CLGDC-N`, el sitio
  es el preview `lgdc-preview-CLGDC-N` si está corriendo y, si no, el dev server del stack.
- `registro.spec.ts` crea cuentas `e2e-registro-<timestamp>@e2e.lgdc.test` con una contraseña al
  azar y espera el correo de bienvenida en Mailpit. Al terminar, pase o no la suite, el script borra
  esas cuentas de la base. Los correos no se borran: quedan en Mailpit (http://localhost:3019) para
  revisarlos, y cada prueba busca solo por su dirección única.
- Sale con el código de Playwright (o 1 si la suite pasó pero la limpieza falló). Los artefactos
  de un fallo (trace, contexto) quedan en `test-results/ultima/`, fuera de git.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
