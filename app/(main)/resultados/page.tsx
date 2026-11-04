import { LDCListingPageTemplate } from "@/components/templates/ldc-listing-page-template";
import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPaginatedListingsGrid } from "@/components/organisms/ldc-paginated-listings-grid";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSearchResults } from "@/components/organisms/ldc-search-results";
import { LDCSearchSummary } from "@/components/molecules/ldc-search-summary";
import { getCategoryFullBySlug, getCityFullBySlug } from "@/lib/api/catalog";
import { searchClassifieds } from "@/lib/api/classifieds";
import { searchListings, SEARCH_TERM_MAX_LENGTH } from "@/lib/api/listings";
import { searchProperties } from "@/lib/api/properties";
import { Search } from "lucide-react";
import type { Metadata } from "next";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface ResultadosPageProps {
  searchParams: SearchParams;
}

/** Los slugs de categoría y ciudad son `a-z`, `0-9` y guiones; otro valor no se manda a la API. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Quita caracteres de control (U+0000–U+001F y U+007F), que no tienen sentido en una búsqueda. */
function stripControlChars(text: string): string {
  return Array.from(text)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 0x1f && code !== 0x7f;
    })
    .join("");
}

/** Lee `?term=&category=&city=` (lo que arma `LDCSearchForm`) y descarta slugs mal formados. */
async function readSearch(searchParams: SearchParams) {
  const params = await searchParams;
  const term = stripControlChars(first(params.term)).trim().slice(0, SEARCH_TERM_MAX_LENGTH);
  const categorySlug = first(params.category).trim();
  const citySlug = first(params.city).trim();
  return {
    term,
    categorySlug: SLUG_PATTERN.test(categorySlug) ? categorySlug : "",
    citySlug: SLUG_PATTERN.test(citySlug) ? citySlug : "",
  };
}

export async function generateMetadata({
  searchParams,
}: ResultadosPageProps): Promise<Metadata> {
  const { term } = await readSearch(searchParams);
  return {
    title: term
      ? `Resultados para «${term}» - La Guía de Chile`
      : "Resultados de búsqueda - La Guía de Chile",
    description:
      "Comercios, servicios, avisos y propiedades de La Guía de Chile que coinciden con tu búsqueda.",
    // Las páginas de resultados no se indexan; los enlaces a las fichas sí se siguen.
    robots: { index: false, follow: true },
  };
}

/**
 * Resultados Page - La Guía de Chile
 *
 * Destino del buscador del hero del inicio (`LDCSearchForm`). Busca en el título y la descripción
 * (sin distinguir tildes) de comercios y servicios, avisos y propiedades publicados, y muestra los
 * resultados agrupados por tipo (`LDCSearchResults`, CLGDC-189). Las consultas van en paralelo y
 * sin data cache. La ciudad filtra los tres tipos; la categoría, comercios, servicios y avisos: las
 * propiedades no tienen categoría, así que con una categoría elegida no se buscan.
 * Una categoría o ciudad que no existe se ignora como filtro. Si la API falla, la página no
 * responde 500: muestra un estado vacío que pide volver a intentarlo.
 *
 * TODO(CLGDC-139): sumar `searchEvents` (`lib/api/event-search.ts`) al `Promise.all` y al total
 * cuando `LDCEventCard` esté en main; el backend ya busca eventos (solo publicados y no terminados).
 */
export default async function ResultadosPage({ searchParams }: ResultadosPageProps) {
  const { term, categorySlug, citySlug } = await readSearch(searchParams);

  let category: Awaited<ReturnType<typeof getCategoryFullBySlug>> = undefined;
  let city: Awaited<ReturnType<typeof getCityFullBySlug>> = undefined;
  let listings: Awaited<ReturnType<typeof searchListings>> = [];
  let classifieds: Awaited<ReturnType<typeof searchClassifieds>> = [];
  let properties: Awaited<ReturnType<typeof searchProperties>> = [];
  let failed = false;
  try {
    [category, city] = await Promise.all([
      categorySlug ? getCategoryFullBySlug(categorySlug) : undefined,
      citySlug ? getCityFullBySlug(citySlug) : undefined,
    ]);
    if (term || category || city) {
      const filters = { term, categoryId: category?.id, cityId: city?.id };
      [listings, classifieds, properties] = await Promise.all([
        searchListings(filters),
        searchClassifieds(filters),
        category ? [] : searchProperties({ term, cityId: city?.id }),
      ]);
    }
  } catch (error) {
    console.error("[resultados] la búsqueda falló:", error);
    failed = true;
  }

  const hasSearch = Boolean(term || category || city);
  const total = listings.length + classifieds.length + properties.length;

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Resultados de búsqueda", href: "" },
  ];

  const emptyMessage = failed
    ? "No pudimos completar la búsqueda"
    : !hasSearch
    ? "Escribe qué buscas"
    : term
      ? `No encontramos resultados para «${term}»`
      : "No encontramos resultados con estos filtros";
  const emptyDescription = failed
    ? "Vuelve a intentarlo en unos minutos."
    : !hasSearch
    ? "Busca comercios, servicios, avisos o propiedades por su nombre o su descripción, o elige una categoría o una ciudad en el buscador del inicio."
    : !term
      ? "Quita la categoría o la ciudad para ver más resultados."
      : category || city
        ? "Revisa cómo lo escribiste, prueba con una palabra más corta o quita la categoría o la ciudad."
        : "Revisa cómo lo escribiste o prueba con una palabra más corta.";

  return (
    <LDCListingPageTemplate
      hero={
        <LDCListingsPageHero
          title="Resultados de búsqueda"
          breadcrumbs={breadcrumbs}
          icon={Search}
        />
      }
    >
      {hasSearch && !failed && (
        <LDCSection paddingY="sm" className="pb-0 md:pb-0">
          <LDCSearchSummary
            term={term}
            categoryName={category?.name}
            cityName={city?.name}
            count={total}
          />
        </LDCSection>
      )}
      {total > 0 ? (
        <LDCSearchResults listings={listings} classifieds={classifieds} properties={properties} />
      ) : (
        // Un único estado vacío para toda la búsqueda (la grilla vacía pinta solo su estado vacío).
        <LDCPaginatedListingsGrid
          listings={[]}
          emptyMessage={emptyMessage}
          emptyDescription={emptyDescription}
        />
      )}
    </LDCListingPageTemplate>
  );
}
