import type { IPlaceType } from "@/interfaces/place";

/**
 * Clases de color por tipo de lugar (CLGDC-207), sobre los tokens `--place-*` de `globals.css`.
 * Cadenas completas para que Tailwind las detecte.
 */
export const PLACE_TONE: Record<IPlaceType, { text: string; tint: string; solid: string }> = {
  ATTRACTION: {
    text: "text-place-attraction",
    tint: "bg-[color-mix(in_oklab,var(--place-attraction)_12%,var(--card))]",
    solid: "border-place-attraction bg-place-attraction text-place-attraction-foreground",
  },
  PUBLIC_SERVICE: {
    text: "text-place-service",
    tint: "bg-[color-mix(in_oklab,var(--place-service)_12%,var(--card))]",
    solid: "border-place-service bg-place-service text-place-service-foreground",
  },
  MARKET: {
    text: "text-place-market",
    tint: "bg-[color-mix(in_oklab,var(--place-market)_12%,var(--card))]",
    solid: "border-place-market bg-place-market text-place-market-foreground",
  },
};

/**
 * Foco de los controles de Lugares (CLGDC-207, como `LDCPublishTile` en CLGDC-203): anillo opaco de
 * 3 px en `pink-strong` (amarillo en oscuro) separado 2 px del fondo, para llegar a 3:1 en los dos
 * temas. `outline-hidden` deja un contorno transparente que en colores forzados sí se ve (el
 * `box-shadow` del anillo desaparece ahí).
 */
export const PLACE_FOCUS_CLASS =
  "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-pink-strong focus-visible:ring-offset-2 focus-visible:ring-offset-card dark:focus-visible:ring-yellow";

/**
 * Acción con borde neutro de los lugares (llamar, ruta, sitio web): pill `rounded-full` de 44 px,
 * fondo de card, borde de marca al pasar el mouse. Va en `<a>` (tel:, mailto: y enlaces externos).
 */
export const PLACE_ACTION_CLASS = `inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:border-pink/60 dark:hover:border-yellow/60 [&_svg]:size-4 [&_svg]:shrink-0 ${PLACE_FOCUS_CLASS}`;

/**
 * Entrada al filtrar: cada hijo entra con `animate-ldc-enter` (300 ms, opacity y transform) y un
 * desfase de 40 ms hasta el cuarto; con `prefers-reduced-motion`, sin animación (`motion-safe:`).
 */
export const PLACES_ENTER_CLASS =
  "motion-safe:[&>*]:animate-ldc-enter motion-safe:[&>*:nth-child(2)]:[animation-delay:40ms] motion-safe:[&>*:nth-child(3)]:[animation-delay:80ms] motion-safe:[&>*:nth-child(n+4)]:[animation-delay:120ms]";

/** Grilla de tarjetas de lugares (1, 2, 3 y 4 columnas). */
export const PLACES_GRID_CLASS =
  "grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
/** Filas de servicios públicos (2 por fila desde `lg`). */
export const PLACES_ROWS_CLASS = "grid grid-cols-1 gap-3 lg:grid-cols-2";
