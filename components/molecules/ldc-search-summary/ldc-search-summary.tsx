import Link from "next/link";

interface LDCSearchSummaryProps {
  /** Término buscado (ya recortado); vacío si solo se filtró por categoría o ciudad */
  term?: string;
  /** Nombre de la categoría elegida, si hay */
  categoryName?: string;
  /** Nombre de la ciudad elegida, si hay */
  cityName?: string;
  /** Cantidad de resultados */
  count: number;
}

/**
 * LDCSearchSummary - Resumen de una búsqueda: cuántos resultados hubo, para qué término y con
 * qué filtros (categoría y ciudad), más un enlace para volver a buscar desde el inicio.
 *
 * @example
 * <LDCSearchSummary term="café" categoryName="Restaurantes" cityName="Santiago" count={3} />
 */
export function LDCSearchSummary({
  term,
  categoryName,
  cityName,
  count,
}: LDCSearchSummaryProps) {
  const filters = [
    categoryName && { label: "Categoría", value: categoryName },
    cityName && { label: "Ciudad", value: cityName },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-3">
        <p className="text-lg text-foreground [overflow-wrap:anywhere]" aria-live="polite">
          <span className="font-semibold">
            {count === 1 ? "1 resultado" : `${count} resultados`}
          </span>
          {term && (
            <>
              {" "}para <span className="font-semibold">«{term}»</span>
            </>
          )}
        </p>
        {filters.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Filtros de la búsqueda">
            {filters.map((f) => (
              <li
                key={f.label}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground"
              >
                <span className="text-muted-foreground">{f.label}:</span>
                <span className="font-semibold">{f.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link
        href="/"
        className="shrink-0 text-sm font-semibold text-foreground underline decoration-pink decoration-2 underline-offset-4 transition-colors hover:decoration-orange dark:decoration-yellow dark:hover:decoration-orange"
      >
        Nueva búsqueda
      </Link>
    </div>
  );
}
