/**
 * Clases de layout compartidas por los átomos de estructura
 * (LDCContainer, LDCSection, LDCPanel). El orden de las clases importa:
 * se conserva tal cual para no alterar el DOM ni lo que deja `twMerge`.
 */

/**
 * Contenedor centrado con padding horizontal. Incluye `container`, que
 * agrega un max-width por breakpoint (luego lo acota `CONTAINER_SIZES`).
 */
export const CONTAINER_BASE = "container mx-auto px-4";

/**
 * Variante «bare», sin `container`: solo centra; el ancho lo pone únicamente
 * `CONTAINER_SIZES`. Se arma como `${CONTAINER_BARE_BASE} ${tamaño} ${CONTAINER_BARE_PADDING_X}`
 * para reproducir el orden real de los heroes: `mx-auto max-w-7xl px-4`.
 */
export const CONTAINER_BARE_BASE = "mx-auto";

/** Padding horizontal de la variante «bare» (va después del tamaño). */
export const CONTAINER_BARE_PADDING_X = "px-4";

/** Ancho máximo del contenedor por tamaño. */
export const CONTAINER_SIZES = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
} as const;

export type ContainerSize = keyof typeof CONTAINER_SIZES;

/** Padding vertical de una sección por tamaño. */
export const SECTION_PADDING_Y = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
} as const;

export type SectionPaddingY = keyof typeof SECTION_PADDING_Y;

/** Carcasa de tarjeta/panel: fondo, borde y radio. */
export const PANEL_BASE = "bg-card rounded-xl border border-border";

/** Padding interno del panel por tamaño. */
export const PANEL_PADDING = {
  md: "p-5",
  lg: "p-6",
} as const;

export type PanelPadding = keyof typeof PANEL_PADDING;
