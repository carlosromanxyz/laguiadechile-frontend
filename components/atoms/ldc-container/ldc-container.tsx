import { cn } from "@/lib/utils";
import {
  CONTAINER_BARE_BASE,
  CONTAINER_BARE_PADDING_X,
  CONTAINER_BASE,
  CONTAINER_SIZES,
  type ContainerSize,
} from "@/lib/ui/layout";
import { ReactNode } from "react";

interface LDCContainerProps {
  /** Contenido */
  children: ReactNode;
  /** Ancho máximo del contenedor (`lg` = `max-w-7xl`) */
  size?: ContainerSize;
  /**
   * Sin la clase `container`. Con `container`, Tailwind agrega un max-width
   * por breakpoint además del `max-w-*` del tamaño; con `bare`, el ancho lo
   * define solo `max-w-*`.
   */
  bare?: boolean;
  /** Clases adicionales (se agregan al final) */
  className?: string;
}

/**
 * LDCContainer - Contenedor centrado de ancho máximo con padding horizontal.
 *
 * - Por defecto: `<div class="container mx-auto px-4 max-w-7xl">`.
 * - `bare`: `<div class="mx-auto max-w-7xl px-4">` (sin `container`; el
 *   patrón de los heroes de detalle).
 *
 * @example
 * ```tsx
 * <LDCContainer size="lg">...</LDCContainer>
 * <LDCContainer bare>...</LDCContainer>
 * ```
 */
export function LDCContainer({
  children,
  size = "lg",
  bare = false,
  className,
}: LDCContainerProps) {
  const classes = bare
    ? cn(CONTAINER_BARE_BASE, CONTAINER_SIZES[size], CONTAINER_BARE_PADDING_X, className)
    : cn(CONTAINER_BASE, CONTAINER_SIZES[size], className);

  return <div className={classes}>{children}</div>;
}
