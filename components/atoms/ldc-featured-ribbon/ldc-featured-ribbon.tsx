import { cn } from "@/lib/utils";

/** Trama diagonal amarilla (SVG 20×20) que marca una card destacada. */
const RIBBON_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23ffbe0b' fill-opacity='0.4'/%3E%3C/svg%3E")`,
  backgroundSize: "20px 20px",
} as const;

interface LDCFeaturedRibbonProps {
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCFeaturedRibbon - Overlay de destacado
 *
 * Capa absoluta con la trama diagonal amarilla que las cards destacadas
 * (comercio, propiedad, noticia) ponen sobre la imagen. No captura eventos.
 * El padre debe ser `relative`; el render condicional queda en el consumidor.
 *
 * @example
 * ```tsx
 * {featured && <LDCFeaturedRibbon />}
 * ```
 */
export function LDCFeaturedRibbon({ className }: LDCFeaturedRibbonProps) {
  return (
    <div
      className={cn("absolute inset-0 opacity-20 pointer-events-none z-[1]", className)}
      style={RIBBON_STYLE}
    />
  );
}
