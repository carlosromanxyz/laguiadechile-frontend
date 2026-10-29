import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LDCStatusFilterItem {
  /** Clave del filtro (el valor de `?estado=`) */
  key: string;
  /** Texto de la pill */
  label: string;
  /** Cantidad de elementos con ese estado */
  count: number;
  /** Destino del enlace (la misma página con su `?estado=`) */
  href: string;
}

export interface LDCStatusFilterProps {
  /** Filtros en orden («Todos» primero) */
  items: readonly LDCStatusFilterItem[];
  /** Clave del filtro activo */
  current: string;
  /** Nombre accesible de la navegación */
  label?: string;
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
  className,
}: LDCStatusFilterProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = item.key === current;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border bg-card px-3 text-sm font-semibold text-foreground transition-colors outline-none hover:border-pink/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:border-yellow/60",
                  active ? "border-pink dark:border-yellow" : "border-border",
                )}
              >
                {item.label}
                <span className="text-xs font-extrabold text-muted-foreground">{item.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
