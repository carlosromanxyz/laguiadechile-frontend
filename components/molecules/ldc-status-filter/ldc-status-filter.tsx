import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LDCStatusFilterItem {
  /** Clave del filtro (el valor de `?estado=`) */
  key: string;
  /** Texto de la pill */
  label: string;
  /** Cantidad de elementos con ese estado; sin ella, la pill no lleva conteo (p. ej. un período) */
  count?: number;
  /** Destino del enlace (la misma página con su `?estado=`) */
  href: string;
  /** Ícono ya renderizado (JSX) antes del texto; opcional */
  icon?: ReactNode;
}

export interface LDCStatusFilterProps {
  /** Filtros en orden («Todos» primero) */
  items: readonly LDCStatusFilterItem[];
  /** Clave del filtro activo */
  current: string;
  /** Nombre accesible de la navegación */
  label?: string;
  /** `sm` (32 px, por defecto) o `lg` (44 px en todos los anchos, CLGDC-207) */
  size?: "sm" | "lg";
  /** En móvil, las pills se desplazan en horizontal en vez de bajar de línea (desde `md`, bajan) */
  scroll?: boolean;
  className?: string;
}

/**
 * LDCStatusFilter - Pills de filtro por estado, con su conteo
 *
 * Server Component: cada pill es un enlace a la misma página con `?estado=`, así el filtro vive
 * en la URL (se comparte y sobrevive a recargar). La activa lleva `aria-current="page"` y el
 * borde de marca (rosado en claro, amarillo en oscuro); el texto queda en `text-foreground` para
 * el contraste (el rosado sobre la card da 4,0:1). En móvil las pills bajan de línea.
 *
 * @example
 * <LDCStatusFilter current="todos" items={[{ key: "todos", label: "Todos", count: 6, href: "/dashboard/avisos" }]} />
 */
export function LDCStatusFilter({
  items,
  current,
  label = "Filtrar por estado",
  size = "sm",
  scroll = false,
  className,
}: LDCStatusFilterProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul
        className={cn(
          "flex flex-wrap gap-2",
          scroll &&
            "-mx-4 flex-nowrap overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0",
        )}
      >
        {items.map((item) => {
          const active = item.key === current;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border bg-card text-sm font-semibold text-foreground transition-colors outline-none hover:border-pink/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:border-yellow/60",
                  size === "lg" ? "h-11 whitespace-nowrap px-4 [&_svg]:size-4 [&_svg]:shrink-0" : "h-8 px-3",
                  active ? "border-pink dark:border-yellow" : "border-border",
                  active && size === "lg" && "shadow-[inset_0_0_0_1px_var(--pink)] dark:shadow-[inset_0_0_0_1px_var(--yellow)]",
                )}
              >
                {item.icon}
                {item.label}
                {item.count != null && (
                  <span className="text-xs font-extrabold text-muted-foreground">{item.count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
