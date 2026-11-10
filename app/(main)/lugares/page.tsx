import { MapPinned } from "lucide-react";
import type { Metadata } from "next";
import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCPlaceFilters } from "@/components/organisms/ldc-place-filters";
import { LDCPlacesDirectory } from "@/components/organisms/ldc-places-directory";
import { LDCListingPageTemplate } from "@/components/templates/ldc-listing-page-template";
import { getCityFullBySlug } from "@/lib/api/catalog";
import { getPlacesPage } from "@/lib/api/places";
import { chileWeekdayIndex, placeTypeFromQuery } from "@/lib/format/places";

export const metadata: Metadata = {
  title: "Lugares - La Guía de Chile",
  description:
    "Atractivos, servicios públicos y ferias de cada ciudad de Chile: qué visitar, dónde hacer trámites, números de emergencia y qué días hay feria.",
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface LugaresPageProps {
  searchParams: Promise<{ tipo?: string | string[]; ciudad?: string | string[] }>;
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * Lugares - La Guía de Chile (CLGDC-207)
 *
 * Atractivos, servicios públicos y ferias que carga el admin. Filtros en la URL: `?tipo=`
 * (atractivos, servicios, ferias; otro valor, todos) y `?ciudad=` (slug; uno mal formado o que no
 * existe se ignora). En «Todos», agrupado por tipo. Si la API aún no tiene lugares, estado vacío.
 */
export default async function LugaresPage({ searchParams }: LugaresPageProps) {
  const params = await searchParams;
  const type = placeTypeFromQuery(first(params.tipo));
  const rawCity = first(params.ciudad);
  const cityInfo = SLUG.test(rawCity) && rawCity.length <= 200 ? await getCityFullBySlug(rawCity) : undefined;
  const city = cityInfo ? { slug: cityInfo.slug, name: cityInfo.name } : undefined;

  const page = await getPlacesPage({ type, city: city?.slug });
  // Una ciudad sin lugares igual se ofrece en el combobox (es la elegida).
  const cities = city && !page.cities.some((c) => c.slug === city.slug)
    ? [...page.cities, { id: cityInfo!.id, ...city }].sort((a, b) => a.name.localeCompare(b.name, "es"))
    : page.cities;

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Lugares", href: "" },
  ];

  return (
    <LDCListingPageTemplate
      hero={<LDCListingsPageHero title="Lugares" breadcrumbs={breadcrumbs} icon={MapPinned} />}
    >
      <LDCPlacesDirectory
        places={page.places}
        type={type}
        city={city}
        today={chileWeekdayIndex()}
        filters={<LDCPlaceFilters type={type} city={city?.slug ?? ""} counts={page.counts} cities={cities} />}
      />
    </LDCListingPageTemplate>
  );
}
