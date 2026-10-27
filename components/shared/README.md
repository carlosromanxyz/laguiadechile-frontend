# Shared

Providers y envoltorios globales que no son parte de la interfaz visible y no encajan en Atomic
Design. Sin prefijo LDC.

**Puede importar:** librerías externas, `@/lib` y `@/components/ui`. Ningún nivel de Atomic Design
(atoms, molecules, organisms, templates). Los usa el layout raíz (`app/layout.tsx`).

Cada uno vive en `x/` con `x.tsx` e `index.ts`, y se importa por la carpeta:
`@/components/shared/x`.

## Componentes

- **theme-provider** (`ThemeProvider`): envoltorio cliente de `next-themes` que habilita el tema claro/oscuro en toda la app. Cliente.
