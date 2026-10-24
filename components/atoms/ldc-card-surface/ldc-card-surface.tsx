import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * Clases de cada carcasa, partidas en los mismos tramos y orden que las cards
 * usan hoy (así `cn` produce exactamente la misma cadena).
 */
const surfaceVariants = {
  /** Card vertical con imagen arriba (comercio, servicio, propiedad, noticia). */
  default: [
    "group bg-card rounded-lg overflow-hidden border border-border",
    "hover:shadow-lg transition-all duration-300",
  ],
  /** Card horizontal en desktop y apilada en móvil (aviso clasificado). */
  horizontal: [
    "group bg-card rounded-xl overflow-hidden border border-border",
    "flex flex-col sm:flex-row",
    "hover:shadow-lg transition-shadow duration-200",
  ],
  /** Card de columna con padding interno y alto completo (post de noticia). */
  padded: ["group flex flex-col h-full bg-card rounded-xl overflow-hidden p-3 border border-border"],
  /** Card de imagen a sangre con sombra, sin borde (ciudad). */
  media: ["group overflow-hidden rounded-xl bg-card dark:bg-neutral-800 shadow-md"],
  /** Tile enlazable con hover de borde (categoría); úsalo con `asChild` sobre el `Link`. */
  tile: [
    "relative block h-full p-6 rounded-xl overflow-hidden",
    "bg-card border border-border",
    "transition-all duration-300",
    "hover:border-purple/50",
  ],
} as const;

export type LDCCardSurfaceVariant = keyof typeof surfaceVariants;

interface LDCCardSurfaceProps extends Omit<HTMLAttributes<HTMLElement>, "className" | "children"> {
  /** Contenido de la card */
  children: ReactNode;
  /** Carcasa (borde, radio, hover, overflow) */
  variant?: LDCCardSurfaceVariant;
  /** Elemento raíz (por defecto `article`) */
  as?: "article" | "div";
  /** Fusiona las clases en el único hijo (p. ej. un `Link`) en vez de crear un elemento */
  asChild?: boolean;
  /** Agrega el anillo amarillo de destacado */
  featured?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCCardSurface - Carcasa común de las cards
 *
 * Pone el fondo, borde, radio, overflow y hover de cada familia de card, más el
 * anillo de destacado. No impone layout interno.
 *
 * @example
 * ```tsx
 * <LDCCardSurface featured={featured} className={className}>…</LDCCardSurface>
 * <LDCCardSurface as="div" featured={featured}>…</LDCCardSurface>
 * <LDCCardSurface variant="horizontal" featured={featured}>…</LDCCardSurface>
 * <LDCCardSurface variant="tile" asChild><Link href="/categoria/x">…</Link></LDCCardSurface>
 * ```
 */
export function LDCCardSurface({
  children,
  variant = "default",
  as: Tag = "article",
  asChild = false,
  featured = false,
  className,
  ...props
}: LDCCardSurfaceProps) {
  const Comp = asChild ? Slot.Root : Tag;

  return (
    <Comp
      className={cn(...surfaceVariants[variant], featured && "ring-2 ring-yellow", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
