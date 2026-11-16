import { cn } from "@/lib/utils";

/**
 * Trama diagonal (SVG 20×20) que marca una card destacada. El SVG va como máscara y el color
 * sale del token `--yellow` (CLGDC-233): un data URI no puede leer variables CSS.
 */
const RIBBON_MASK = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/svg%3E")`;
const RIBBON_STYLE = {
  backgroundColor: "color-mix(in oklab, var(--yellow) 40%, transparent)",
  maskImage: RIBBON_MASK,
  WebkitMaskImage: RIBBON_MASK,
  maskSize: "20px 20px",
  WebkitMaskSize: "20px 20px",
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
