import { Home, Megaphone, Store } from "lucide-react";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCPaginatedClassifiedsList } from "@/components/organisms/ldc-paginated-classifieds-list";
import { LDCPaginatedListingsGrid } from "@/components/organisms/ldc-paginated-listings-grid";
import { LDCPaginatedPropertiesGrid } from "@/components/organisms/ldc-paginated-properties-grid";
import type { IClassifieds } from "@/interfaces/classified";
import type { IListingDetails } from "@/interfaces/listing";
import type { IProperties } from "@/interfaces/property";

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
}

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * LDCSearchResults - Resultados de `/resultados` agrupados por tipo (CLGDC-189): comercios y
 * servicios, avisos y propiedades, en ese orden. Cada grupo tiene su encabezado con la cantidad y
 * su grilla paginada de siempre (`LDCListingCard`, `LDCClassifiedCard`, `LDCPropertyCard`), con
 * los primeros 8 y «Cargar más». Un grupo sin resultados no se muestra; el estado vacío de la
 * búsqueda completa lo pone la página.
 *
 * TODO(CLGDC-139): agregar el grupo de eventos al final, con `LDCEventCard` y los datos de
 * `searchEvents` (`lib/api/event-search.ts`), cuando CLGDC-139 esté en main.
 *
 * @example
 * <LDCSearchResults listings={listings} classifieds={classifieds} properties={properties} />
 */
export function LDCSearchResults({ listings, classifieds, properties }: LDCSearchResultsProps) {
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
    </>
  );
}
