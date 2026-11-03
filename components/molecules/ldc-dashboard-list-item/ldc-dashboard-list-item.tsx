import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LDCDashboardListItemProps {
  /** Miniatura (48 px, decorativa); sin ella, la fila empieza por el texto (p. ej. Usuarios o Regiones) */
  image?: string | null;
  /** Título del elemento */
  title: ReactNode;
  /** Línea sobre el título: badges y datos cortos («hace 2 h · Valparaíso») */
  meta?: ReactNode;
  /** Línea bajo el título, en gris */
  subtitle?: ReactNode;
  /** Párrafo de texto bajo el subtítulo, en hasta 3 líneas (siempre texto, nunca HTML) */
  description?: string;
  /**
   * Botones de la fila: `LDCButton` o `Button` con `size="sm"`, como hijos directos (un fragmento
   * sirve). A la derecha si la fila mide al menos 32 rem; si no, debajo del texto, a la derecha y
   * con 44 px de alto.
   */
  actions?: ReactNode;
  /** Título en hasta 2 líneas (por defecto, 1 línea truncada) */
  clampTitle?: boolean;
}

/**
 * LDCDashboardListItem - Fila con miniatura de las listas del panel
 *
 * Miniatura, línea de badges, título, subtítulo y acciones. La fila es un `@container`: si
 * mide al menos 32 rem (`@lg`), las acciones van a su derecha (columna sin encoger, centrada en
 * vertical); si es más angosta (móvil o una card estrecha en un grid), van debajo del texto,
 * alineadas a la derecha y con objetivos de 44 px. Las filas se separan con un borde superior
 * (la primera no lo lleva). La usan la cola de moderación (Moderación e inicio del admin),
 * «Mis avisos», la ficha principal del inicio del panel y «Últimas noticias».
 *
 * @example
 * <LDCDashboardListItem image={n.image} title={n.title} subtitle="20 dic 2024 · María González" clampTitle />
 */
export function LDCDashboardListItem({
  image,
  title,
  meta,
  subtitle,
  description,
  actions,
  clampTitle,
}: LDCDashboardListItemProps) {
  return (
    <li className="@container flex min-w-0 items-start gap-3 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0">
      {image && (
        <Image
          src={image}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-md bg-muted object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2 @lg:flex-row @lg:items-center @lg:gap-4">
        <div className="min-w-0 flex-1">
          {meta != null && (
            <div className="mb-1 flex flex-wrap items-center gap-2 font-open-sans text-xs text-muted-foreground">
              {meta}
            </div>
          )}
          <p className={cn("font-bold", clampTitle ? "line-clamp-2 text-sm" : "truncate")}>{title}</p>
          {subtitle != null && (
            <p className="truncate font-open-sans text-xs text-muted-foreground">{subtitle}</p>
          )}
          {description && (
            <p className="mt-1 line-clamp-3 font-open-sans text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions != null && (
          <div className="flex flex-wrap justify-end gap-2 @lg:shrink-0 [&>[data-slot=button]]:h-11 @lg:[&>[data-slot=button]]:h-8">
            {actions}
          </div>
        )}
      </div>
    </li>
  );
}
