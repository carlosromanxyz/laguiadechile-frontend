# Shared

Providers y envoltorios globales que no son parte de la interfaz visible y no encajan en Atomic
Design. Los envoltorios de terceros van sin prefijo LDC (`theme-provider`); los propios lo llevan
(`ldc-motion-pause-provider`).

**Puede importar:** librerías externas, `@/lib` y `@/components/ui`. Ningún nivel de Atomic Design
(atoms, molecules, organisms, templates). Los usa el layout raíz (`app/layout.tsx`); los providers de sección (como
`ldc-motion-pause-provider`) los usan también los niveles de Atomic Design que los necesitan.

Cada uno vive en `x/` con `x.tsx` e `index.ts`, y se importa por la carpeta:
`@/components/shared/x`.

## Componentes

- **ldc-motion-pause-provider** (`LDCMotionPauseProvider`, `useLDCMotionPause`): pausa compartida de las animaciones de una sección (WCAG 2.2.2); la leen `LDCDecorativeShape`, `LDCMotionPauseButton` y la escena de `LDCAboutHeroIllustration`. Envuelve en un `div` con `display: contents` que lleva `data-ldc-motion-paused` para pausar también animaciones CSS. Cliente.
- **theme-provider** (`ThemeProvider`): envoltorio cliente de `next-themes` que habilita el tema claro/oscuro en toda la app. Cliente.
