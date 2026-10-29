import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LDCDashboardListItemProps {
  /** Miniatura (48 px, decorativa) */
  image: string;
  /** Título del elemento */
  title: ReactNode;
  /** Línea sobre el título: badges y datos cortos («hace 2 h · Valparaíso») */
  meta?: ReactNode;
  /** Línea bajo el título, en gris */
  subtitle?: ReactNode;
  /** Párrafo de texto bajo el subtítulo, en hasta 3 líneas (siempre texto, nunca HTML) */
  description?: string;
  /** Botones bajo el texto */
  actions?: ReactNode;
  /** Título en hasta 2 líneas (por defecto, 1 línea truncada) */
  clampTitle?: boolean;
}

/**
 * LDCDashboardListItem - Fila con miniatura de las listas del panel
 *
 * Miniatura, línea de badges, título, subtítulo y acciones. Las filas se separan con un
 * borde superior (la primera no lo lleva). La usan la cola de moderación, «Mis avisos» y
 * «Últimas noticias».
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
    <li className="flex min-w-0 items-start gap-3 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0">
      <Image
        src={image}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-md bg-muted object-cover"
      />
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
        {actions != null && <div className="mt-2 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </li>
  );
}
