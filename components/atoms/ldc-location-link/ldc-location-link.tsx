import { cn } from "@/lib/utils";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ReactNode } from "react";

interface LDCLocationLinkProps {
  /** Destino del enlace (p. ej. `/ciudad/santiago`) */
  href: string;
  /** Texto del enlace (ciudad o ubicación) */
  children: ReactNode;
  /**
   * - `default`: enlace completo, ícono + texto truncado (comercio/servicio, post).
   * - `compact`: enlace sin tipografía propia, hereda la del padre (aviso).
   * - `split`: fila con ícono, enlace a la ciudad, «/» y `details` sin enlace (propiedad).
   */
  variant?: "default" | "compact" | "split";
  /** Texto tras el separador «/» (solo `split`; si falta, no se pinta el separador) */
  details?: ReactNode;
  /**
   * Reemplaza el ícono `MapPin` (p. ej. el ícono de categoría del post).
   * `undefined` usa el `MapPin` de la variante; `null` no pinta ícono.
   */
  icon?: ReactNode;
  /** Optional className for custom styling (va al elemento raíz) */
  className?: string;
}

/**
 * LDCLocationLink - Ícono de ubicación + texto enlazado
 *
 * Las clases de cada variante son las que usan hoy las cards, en el mismo orden.
 *
 * @example
 * ```tsx
 * <LDCLocationLink href={`/ciudad/${city.slug}`}>{city.name}</LDCLocationLink>
 * <LDCLocationLink href={`/ciudad/${city.slug}`} variant="compact">{location}</LDCLocationLink>
 * <LDCLocationLink href={`/ciudad/${city.slug}`} variant="split" details={commune}>
 *   {city.name}
 * </LDCLocationLink>
 * ```
 */
export function LDCLocationLink({
  href,
  children,
  variant = "default",
  details,
  icon,
  className,
}: LDCLocationLinkProps) {
  if (variant === "split") {
    return (
      <div
        className={cn("flex items-center gap-1 text-sm text-muted-foreground truncate", className)}
      >
        {icon === undefined ? (
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-pink dark:text-yellow" />
        ) : (
          icon
        )}
        <Link href={href} className="hover:text-pink dark:hover:text-yellow transition-colors">
          {children}
        </Link>
        {details != null && (
          <>
            <span className="text-muted-foreground/60">/</span>
            <span className="truncate">{details}</span>
          </>
        )}
      </div>
    );
  }

  const isCompact = variant === "compact";

  return (
    <Link
      href={href}
      className={cn(
        isCompact
          ? "flex items-center gap-1 hover:text-pink dark:hover:text-yellow transition-colors"
          : "flex items-center gap-1.5 text-sm text-muted-foreground min-w-0 hover:text-pink dark:hover:text-yellow transition-colors",
        className
      )}
    >
      {icon === undefined ? (
        <MapPin
          className={
            isCompact
              ? "w-4 h-4 text-pink dark:text-yellow flex-shrink-0"
              : "w-4 h-4 flex-shrink-0 text-pink dark:text-yellow"
          }
        />
      ) : (
        icon
      )}
      <span className="truncate">{children}</span>
    </Link>
  );
}
