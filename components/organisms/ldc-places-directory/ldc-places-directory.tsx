import Link from "next/link";
import { MapPinOff } from "lucide-react";
import type { ReactNode } from "react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCPlaceTypeIcon } from "@/components/atoms/ldc-place-type-icon";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCPlaceCard } from "@/components/molecules/ldc-place-card";
import { LDCPlaceRow } from "@/components/molecules/ldc-place-row";
import type { IPlaces, IPlaceType } from "@/interfaces/place";
import { PLACE_TYPES, PLACE_TYPE_META } from "@/lib/format/places";
import { PLACE_TONE, PLACES_ENTER_CLASS, PLACES_GRID_CLASS, PLACES_ROWS_CLASS } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

/** Cuántos de cada tipo se ven en «Todos» (el resto, con «Ver los N →»). */
const GROUP_CARDS = 4;
const GROUP_ROWS = 6;

export interface LDCPlacesDirectoryProps {
  /** Lugares ya filtrados (destacados primero y luego por título) */
  places: IPlaces;
  /** Tipo elegido; sin él, la lista va agrupada por tipo */
  type?: IPlaceType;
  /** Ciudad elegida (slug y nombre); vacía, todo Chile */
  city?: { slug: string; name: string };
  /** Día de hoy en Chile (0 = lunes) al renderizar */
  today: number;
  /** Filtros (`LDCPlaceFilters`) */
  filters: ReactNode;
}

function PlacesGrid({ places, type, today, className }: { places: IPlaces; type: IPlaceType; today: number; className?: string }) {
  return type === "PUBLIC_SERVICE" ? (
    <div className={cn(PLACES_ROWS_CLASS, PLACES_ENTER_CLASS, className)}>
      {places.map((p) => (
        <LDCPlaceRow key={p.id} place={p} today={today} />
      ))}
    </div>
  ) : (
    <div className={cn(PLACES_GRID_CLASS, PLACES_ENTER_CLASS, className)}>
      {places.map((p) => (
        <LDCPlaceCard key={p.id} place={p} today={today} />
      ))}
    </div>
  );
}

/**
 * LDCPlacesDirectory - Cuerpo de `/lugares` (alternativa B de CLGDC-207)
 *
 * Filtros arriba. En «Todos», agrupado por tipo: hasta 4 atractivos y 4 ferias en tarjetas y hasta 6
 * servicios públicos en filas (`LDCPlaceRow`, 2 por fila desde `lg`), cada grupo con su encabezado y
 * «Ver los N →» (activa su pill). Con un tipo elegido, la grilla o las filas completas y el conteo.
 * Sin resultados, `LDCEmptyState` sin CTA de publicar (lo carga el admin): la misma ciudad sin el
 * tipo, o limpiar los filtros. Las tarjetas entran al filtrar solo con `motion-safe`.
 *
 * @example
 * <LDCPlacesDirectory places={places} type="MARKET" today={today} filters={<LDCPlaceFilters … />} />
 */
export function LDCPlacesDirectory({ places, type, city, today, filters }: LDCPlacesDirectoryProps) {
  const where = city ? `en ${city.name}` : "en todo Chile";
  const filterKey = `${type ?? "ALL"}|${city?.slug ?? ""}`;

  let body: ReactNode;
  if (places.length === 0) {
    const what = type ? PLACE_TYPE_META[type].plural.toLowerCase() : "lugares";
    body = (
      <LDCEmptyState
        icon={<MapPinOff className="size-12 text-muted-foreground" aria-hidden />}
        title={city ? `No encontramos ${what} en ${city.name}` : `Aún no hay ${what}`}
        description={
          <>
            {type || city ? "Prueba con otro tipo o con todas las ciudades. " : ""}Si conoces uno, cuéntanos y lo
            sumamos.
          </>
        }
        action={
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {type && city && (
              <LDCButton href={`/lugares?ciudad=${city.slug}`} variant="outline" className="h-11 rounded-full px-4">
                Ver todos los lugares de {city.name}
              </LDCButton>
            )}
            {(type || city) && (
              <LDCButton href="/lugares" variant="ghost" className="h-11 rounded-full px-4">
                Limpiar filtros
              </LDCButton>
            )}
            <LDCButton href="/contacto" variant="ghost" className="h-11 rounded-full px-4">
              Sugerir un lugar
            </LDCButton>
          </div>
        }
      />
    );
  } else if (type) {
    body = (
      <>
        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
          {places.length} {places.length === 1 ? "lugar" : "lugares"} {where}
        </p>
        <PlacesGrid key={filterKey} places={places} type={type} today={today} />
      </>
    );
  } else {
    body = (
      <div key={filterKey}>
        <p className="sr-only" aria-live="polite">
          {places.length} {places.length === 1 ? "lugar" : "lugares"} {where}
        </p>
        {PLACE_TYPES.map((t) => {
          const group = places.filter((p) => p.type === t);
          if (group.length === 0) return null;
          const shown = group.slice(0, t === "PUBLIC_SERVICE" ? GROUP_ROWS : GROUP_CARDS);
          const meta = PLACE_TYPE_META[t];
          const tone = PLACE_TONE[t];
          const headingId = `ldc-lugares-${meta.query}`;
          const more = `/lugares?tipo=${meta.query}${city ? `&ciudad=${city.slug}` : ""}`;
          return (
            <section key={t} aria-labelledby={headingId} className="mb-10 last:mb-0">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", tone.tint)} aria-hidden>
                    <LDCPlaceTypeIcon type={t} className={cn("size-5", tone.text)} />
                  </span>
                  <div className="min-w-0">
                    <h2 id={headingId} className="font-mulish text-xl font-bold text-foreground">
                      {meta.plural}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {group.length} {where}
                    </p>
                  </div>
                </div>
                {group.length > shown.length && (
                  <Link
                    href={more}
                    className="inline-flex min-h-11 shrink-0 items-center text-sm text-pink-strong hover:underline dark:text-yellow"
                  >
                    Ver los {group.length} →
                  </Link>
                )}
              </div>
              <PlacesGrid places={shown} type={t} today={today} />
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <LDCSection paddingY="lg">
      <div className="mb-6">{filters}</div>
      {body}
    </LDCSection>
  );
}
