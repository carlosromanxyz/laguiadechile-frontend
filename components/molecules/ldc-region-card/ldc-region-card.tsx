import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface LDCRegionCardProps {
  /** Nombre de la región */
  name: string;
  /** Slug de la región para la URL `/region/<slug>` */
  slug: string;
  /** Numeral romano de la región (p. ej. "XIII") */
  romanNumeral: string;
  /** Cantidad de ciudades de la región */
  citiesCount: number;
}

/**
 * LDCRegionCard - Tarjeta de región
 *
 * Server Component: enlace a la página de la región con el numeral romano,
 * el nombre, el conteo de ciudades y una flecha.
 *
 * @example
 * <LDCRegionCard
 *   name="Región Metropolitana"
 *   slug="metropolitana"
 *   romanNumeral="XIII"
 *   citiesCount={52}
 * />
 */
export function LDCRegionCard({
  name,
  slug,
  romanNumeral,
  citiesCount,
}: LDCRegionCardProps) {
  return (
    <Link
      href={`/region/${slug}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-pink dark:hover:border-yellow hover:shadow-lg transition-all duration-200"
    >
      {/* Roman numeral badge */}
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple/10 to-pink/10 dark:from-purple/20 dark:to-pink/20 flex-shrink-0">
        <span className="text-sm font-bold text-purple">{romanNumeral}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold font-mulish text-foreground group-hover:text-pink dark:group-hover:text-yellow transition-colors truncate">
          {name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {citiesCount} {citiesCount === 1 ? "ciudad" : "ciudades"}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-pink dark:group-hover:text-yellow transition-colors flex-shrink-0" />
    </Link>
  );
}
