import { cn } from "@/lib/utils";
import { LDCContainer } from "@/components/atoms/ldc-container";
import { LDCBreadcrumbs } from "@/components/molecules/ldc-breadcrumbs";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";
import type { ReactNode } from "react";

/**
 * Clases de la sección por variante. Cada una es la cadena completa, en el
 * orden original, para no alterar el DOM.
 */
const sectionClasses = {
  /** Heroes de detalle (comercio, servicio, aviso, propiedad, noticia) */
  detail: "relative w-full bg-purple/20 pt-24 pb-8 md:pt-28 md:pb-12",
  /** Hero de las páginas de listado */
  listing: "relative w-full bg-purple/20 pt-24 pb-12 md:pt-28 md:pb-16",
} as const;

export type LDCDetailHeroVariant = keyof typeof sectionClasses;

interface LDCDetailHeroProps {
  /** Migas de pan que van sobre el contenido */
  breadcrumbs: IBreadcrumbItem[];
  /** Contenido del hero, debajo de las migas */
  children: ReactNode;
  /** `detail` (por defecto) o `listing`: solo cambia el padding vertical */
  variant?: LDCDetailHeroVariant;
  /** Clases adicionales para la sección */
  className?: string;
}

/**
 * LDCDetailHero - Carcasa común de los heroes de detalle y de listado
 *
 * Sección con fondo morado, contenedor centrado (`LDCContainer bare`) y migas
 * de pan; el contenido propio de cada hero va como `children`.
 * Es Server Component: los heroes le pasan íconos Lucide ya renderizados.
 *
 * @example
 * ```tsx
 * <LDCDetailHero breadcrumbs={breadcrumbs} className={className}>
 *   <h1>{title}</h1>
 * </LDCDetailHero>
 * ```
 */
export function LDCDetailHero({
  breadcrumbs,
  children,
  variant = "detail",
  className,
}: LDCDetailHeroProps) {
  return (
    <section className={cn(sectionClasses[variant], className)}>
      <LDCContainer bare>
        {/* Breadcrumbs */}
        <LDCBreadcrumbs items={breadcrumbs} variant="light" className="mb-6" />

        {children}
      </LDCContainer>
    </section>
  );
}
