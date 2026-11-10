import { MapPinOff } from "lucide-react";
import type { ReactNode } from "react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCPlaceTypeIcon } from "@/components/atoms/ldc-place-type-icon";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCPlaceCard } from "@/components/molecules/ldc-place-card";
import { LDCPlaceRow } from "@/components/molecules/ldc-place-row";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
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
  const rows = type === "PUBLIC_SERVICE";
  return (
    // `role="list"`: Safari quita la semántica de las listas sin viñetas
    <ul role="list" className={cn(rows ? PLACES_ROWS_CLASS : PLACES_GRID_CLASS, PLACES_ENTER_CLASS, className)}>
      {places.map((p) => (
        <li key={p.id}>{rows ? <LDCPlaceRow place={p} today={today} /> : <LDCPlaceCard place={p} today={today} />}</li>
      ))}
    </ul>
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
 * Un único `role="status"` siempre montado (fuera de las ramas y de los `key`) anuncia el resultado
 * al filtrar: «N lugares en X» o el título del estado vacío.
 *
 * @example
 * <LDCPlacesDirectory places={places} type="MARKET" today={today} filters={<LDCPlaceFilters … />} />
 */
export function LDCPlacesDirectory({ places, type, city, today, filters }: LDCPlacesDirectoryProps) {
  const where = city ? `en ${city.name}` : "en todo Chile";
  const filterKey = `${type ?? "ALL"}|${city?.slug ?? ""}`;
  const count = `${places.length} ${places.length === 1 ? "lugar" : "lugares"} ${where}`;
  const what = type ? PLACE_TYPE_META[type].plural.toLowerCase() : "lugares";
  const emptyTitle = city ? `No encontramos ${what} en ${city.name}` : `Aún no hay ${what}`;

  let body: ReactNode;
  if (places.length === 0) {
    body = (
      <LDCEmptyState
        icon={<MapPinOff className="size-12 text-muted-foreground" aria-hidden />}
        title={emptyTitle}
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
        {/* h2 entre el h1 de la página y los h3 de las tarjetas */}
        <h2 className="mb-6 text-sm font-normal text-muted-foreground">{count}</h2>
        <PlacesGrid key={filterKey} places={places} type={type} today={today} />
      </>
    );
  } else {
    body = (
      <div key={filterKey}>
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
              <LDCSectionHeader
                variant="compact"
                size="sm"
                title={meta.plural}
                titleId={headingId}
                icon={<LDCPlaceTypeIcon type={t} className={cn("size-5", tone.text)} />}
                tileClassName={tone.tint}
                subtitle={`${group.length} ${where}`}
                viewAllHref={group.length > shown.length ? more : undefined}
                viewAllLabel={`Ver los ${group.length}`}
                viewAllOnMobile
                className="mb-4"
              />
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
      <p role="status" aria-live="polite" className="sr-only">
        {places.length === 0 ? emptyTitle : count}
      </p>
      {body}
    </LDCSection>
  );
}
