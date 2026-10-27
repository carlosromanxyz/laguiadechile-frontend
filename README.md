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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
