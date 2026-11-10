import { CalendarDays, Home, MapPinned, Megaphone, Store } from "lucide-react";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCPaginatedClassifiedsList } from "@/components/organisms/ldc-paginated-classifieds-list";
import { LDCPaginatedEventsGrid } from "@/components/organisms/ldc-paginated-events-grid";
import { LDCPaginatedListingsGrid } from "@/components/organisms/ldc-paginated-listings-grid";
import { LDCPaginatedPropertiesGrid } from "@/components/organisms/ldc-paginated-properties-grid";
import type { IClassifieds } from "@/interfaces/classified";
import type { IEvents } from "@/interfaces/event";
import type { IListingDetails } from "@/interfaces/listing";
import type { IProperties } from "@/interfaces/property";
import type { IPlaces } from "@/interfaces/place";
import { LDCPlaceCard } from "@/components/molecules/ldc-place-card";
import { PLACE_TONE, PLACES_GRID_CLASS } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

/** Resultados que se muestran de entrada en cada grupo; el resto, con «Cargar más». */
const GROUP_PAGE_SIZE = 8;

/** El encabezado va pegado a su grilla; la grilla deja el aire hasta el grupo siguiente. */
const HEADER_SECTION = "pb-0 md:pb-0";
const GRID_SECTION = "pt-0 md:pt-0 pb-8 md:pb-12";

interface LDCSearchResultsProps {
  /** Comercios y servicios que coinciden */
  listings: IListingDetails;
  /** Avisos que coinciden */
  classifieds: IClassifieds;
  /** Propiedades que coinciden */
  properties: IProperties;
  /** Eventos que coinciden (publicados y sin terminar) */
  events: IEvents;
  /** Instante de referencia (ms) de la grilla de eventos; lo fija la página al renderizar */
  now: number;
  /** Lugares que coinciden (CLGDC-207) */
  places?: IPlaces;
  /** Día de hoy en Chile (0 = lunes) para las tarjetas de lugares */
  today?: number;
}

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * LDCSearchResults - Resultados de `/resultados` agrupados por tipo (CLGDC-189): comercios y
 * servicios, avisos, propiedades, eventos y lugares (CLGDC-207), en ese orden. Cada grupo tiene su encabezado con la
 * cantidad y su grilla paginada de siempre (`LDCListingCard`, `LDCClassifiedCard`,
 * `LDCPropertyCard`, `LDCEventCard`), con los primeros 8 y «Cargar más». Un grupo sin resultados
 * no se muestra; el estado vacío de la búsqueda completa lo pone la página.
 *
 * @example
 * <LDCSearchResults
 *   listings={listings}
 *   classifieds={classifieds}
 *   properties={properties}
 *   events={events}
 *   now={now}
 * />
 */
export function LDCSearchResults({
  listings,
  classifieds,
  properties,
  events,
  now,
  places = [],
  today = 0,
}: LDCSearchResultsProps) {
  return (
    <>
      {listings.length > 0 && (
        <>
          <LDCSection paddingY="sm" className={HEADER_SECTION}>
            <LDCSectionHeader
              variant="compact"
              title="Comercios y servicios"
              icon={<Store className="w-5 h-5 text-pink" aria-hidden="true" />}
              tone="pink"
              subtitle={countLabel(listings.length, "resultado", "resultados")}
            />
          </LDCSection>
          <LDCPaginatedListingsGrid
            listings={listings}
            itemsPerPage={GROUP_PAGE_SIZE}
            columns={4}
            loadMoreLabel="Cargar más comercios y servicios"
            className={GRID_SECTION}
          />
        </>
      )}
      {classifieds.length > 0 && (
        <>
          <LDCSection paddingY="sm" className={HEADER_SECTION}>
            <LDCSectionHeader
              variant="compact"
              title="Avisos"
              icon={<Megaphone className="w-5 h-5 text-orange" aria-hidden="true" />}
              tone="orange"
              subtitle={countLabel(classifieds.length, "resultado", "resultados")}
            />
          </LDCSection>
          <LDCPaginatedClassifiedsList
            classifieds={classifieds}
            itemsPerPage={GROUP_PAGE_SIZE}
            loadMoreLabel="Cargar más avisos"
            className={GRID_SECTION}
          />
        </>
      )}
      {properties.length > 0 && (
        <>
          <LDCSection paddingY="sm" className={HEADER_SECTION}>
            <LDCSectionHeader
              variant="compact"
              title="Propiedades"
              icon={<Home className="w-5 h-5 text-purple" aria-hidden="true" />}
              tone="purple"
              subtitle={countLabel(properties.length, "resultado", "resultados")}
            />
          </LDCSection>
          <LDCPaginatedPropertiesGrid
            properties={properties}
            itemsPerPage={GROUP_PAGE_SIZE}
            loadMoreLabel="Cargar más propiedades"
            className={GRID_SECTION}
          />
        </>
      )}
      {events.length > 0 && (
        <>
          <LDCSection paddingY="sm" className={HEADER_SECTION}>
            <LDCSectionHeader
              variant="compact"
              title="Eventos"
              icon={<CalendarDays className="w-5 h-5 text-pink" aria-hidden="true" />}
              tone="pink"
              subtitle={countLabel(events.length, "resultado", "resultados")}
            />
          </LDCSection>
          <LDCPaginatedEventsGrid
            events={events}
            now={now}
            itemsPerPage={GROUP_PAGE_SIZE}
            loadMoreLabel="Cargar más eventos"
            className={GRID_SECTION}
          />
        </>
      )}
      {places.length > 0 && (
        <>
          <LDCSection paddingY="sm" className={HEADER_SECTION}>
            <LDCSectionHeader
              variant="compact"
              title="Lugares"
              icon={<MapPinned className={cn("w-5 h-5", PLACE_TONE.ATTRACTION.text)} aria-hidden="true" />}
              tileClassName={PLACE_TONE.ATTRACTION.tint}
              subtitle={countLabel(places.length, "resultado", "resultados")}
            />
          </LDCSection>
          <LDCSection paddingY="sm" className={GRID_SECTION}>
            <div className={PLACES_GRID_CLASS}>
              {places.map((place) => (
                <LDCPlaceCard key={place.id} place={place} today={today} />
              ))}
            </div>
          </LDCSection>
        </>
      )}
    </>
  );
}
