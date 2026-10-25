import { LDCCityTemplate } from "@/components/templates/ldc-city-template";
import { LDCCityLiveInfo } from "./_components/ldc-city-live-info";
import { LDCCityWikipedia } from "./_components/ldc-city-wikipedia";
import { getAllCitiesFromRegions, getCityBySlugFromRegions } from "@/services/regions";
import { getListingsByCity } from "@/services/featured-listings";
import { getPropertiesByCity } from "@/services/properties";
import { getClassifiedsByCity } from "@/services/classifieds";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all cities from all regions
 */
export async function generateStaticParams() {
  const cities = await getAllCitiesFromRegions();
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

/**
 * Generate metadata for the city page
 */
export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCityBySlugFromRegions(slug);

  if (!result) {
    return {
      title: "Ciudad no encontrada - La Guía de Chile",
    };
  }

  return {
    title: `${result.city.name} - La Guía de Chile`,
    description: `Descubre comercios, servicios, propiedades y avisos en ${result.city.name}, Chile.`,
  };
}

/**
 * City Page - La Guía de Chile
 *
 * Displays all content in a specific city organized by type:
 * - Comercios & Servicios (listings)
 * - Propiedades (properties)
 * - Avisos (classifieds)
 *
 * Server Component: lee la DAL y se la pasa a `LDCCityTemplate`. El clima y la farmacia de turno
 * (`LDCCityLiveInfo`) y el resumen de Wikipedia (`LDCCityWikipedia`) se piden en el cliente.
 */
export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const result = await getCityBySlugFromRegions(slug);

  if (!result) {
    notFound();
  }

  const { city, region } = result;

  const [listings, properties, classifieds] = await Promise.all([
    getListingsByCity(slug),
    getPropertiesByCity(slug),
    getClassifiedsByCity(slug),
  ]);

  return (
    <LDCCityTemplate
      city={city}
      region={region}
      listings={listings}
      properties={properties}
      classifieds={classifieds}
      wikipedia={<LDCCityWikipedia cityName={city.name} />}
      liveInfo={<LDCCityLiveInfo cityName={city.name} />}
    />
  );
}
