import Link from "next/link";
import { cn } from "@/lib/utils";

const numberFormat = new Intl.NumberFormat("es-CL");

export interface LDCStatusCountItem {
  /** Clave estable (p. ej. el estado de la API) */
  key: string;
  /** Nombre del estado en plural («Publicados», «En revisión») */
  label: string;
  value: number;
  /** Si hay, la celda lleva al listado filtrado por ese estado */
  href?: string;
  /** `alert`: el valor va en rojo cuando es mayor que cero (p. ej. rechazadas) */
  tone?: "default" | "alert";
}

export interface LDCStatusCountsProps {
  items: LDCStatusCountItem[];
  className?: string;
}

/**
 * LDCStatusCounts - Publicaciones de una cuenta por estado
 *
 * Grilla de celdas planas (`bg-muted`, sin sombra) de a dos por fila (cambia con `className`): el
 * valor arriba y el estado abajo. Cada celda con `href` es un enlace al listado filtrado.
 *
 * @example
 * <LDCStatusCounts items={[{ key: "PUBLISHED", label: "Publicados", value: 3, href: "/dashboard/avisos?estado=publicados" }]} />
 */
export function LDCStatusCounts({ items, className }: LDCStatusCountsProps) {
  return (
    <ul className={cn("grid grid-cols-2 gap-2", className)}>
      {items.map((item) => {
        const body = (
          <>
            <span className="font-open-sans text-xs text-muted-foreground">{item.label}</span>
            <span
              className={cn(
                "text-lg font-black",
                item.tone === "alert" && item.value > 0 && "text-destructive",
              )}
            >
              {numberFormat.format(item.value)}
            </span>
          </>
        );
        const cell = "flex h-full flex-col-reverse rounded-md bg-muted p-2";
        return (
          <li key={item.key}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  cell,
                  "outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
                )}
              >
                {body}
              </Link>
            ) : (
              <div className={cell}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
