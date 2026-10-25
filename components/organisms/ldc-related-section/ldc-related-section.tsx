import { LDCSection } from "@/components/atoms/ldc-section";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Disposición de las tarjetas relacionadas. */
const LAYOUT_CLASSES = {
  /** Comercios, servicios y propiedades */
  "grid-4": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
  /** Noticias */
  "grid-3": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  /** Avisos (tarjetas horizontales apiladas) */
  list: "space-y-4",
} as const;

interface LDCRelatedSectionProps {
  /** Título de la sección (p. ej. «Comercios Relacionados») */
  title: string;
  /** Tarjetas ya renderizadas, cada una con su `key` */
  children: ReactNode;
  /** Disposición de las tarjetas. Por defecto, grilla de 4 columnas */
  layout?: keyof typeof LAYOUT_CLASSES;
  /** Clases adicionales de la sección */
  className?: string;
}

/**
 * LDCRelatedSection - Sección de contenido relacionado al pie de una ficha.
 *
 * Franja con fondo atenuado, título y las tarjetas en grilla o lista.
 * Quien la usa decide si se muestra (p. ej. solo con resultados).
 *
 * @example
 * ```tsx
 * <LDCRelatedSection title="Noticias Relacionadas" layout="grid-3">
 *   {news.map((n) => <LDCNewsCard key={n.id} {...n} />)}
 * </LDCRelatedSection>
 * ```
 */
export function LDCRelatedSection({
  title,
  children,
  layout = "grid-4",
  className,
}: LDCRelatedSectionProps) {
  return (
    <LDCSection paddingY="md" className={cn("bg-muted/30", className)}>
      <h2 className="text-2xl font-bold font-mulish text-foreground mb-6">
        {title}
      </h2>
      <div className={LAYOUT_CLASSES[layout]}>{children}</div>
    </LDCSection>
  );
}
