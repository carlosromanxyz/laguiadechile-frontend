import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCListingPageTemplate } from "@/components/templates/ldc-listing-page-template";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCCityCard } from "@/components/molecules/ldc-city-card";
import { getAllCitiesFromRegions, getTotalCitiesCount } from "@/services/regions";
import { getCityImage, getMockCityCount } from "@/lib/format/cities";
import { MapPin } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ciudades de Chile - La Guía de Chile",
  description:
    "Explora todas las ciudades de Chile. Encuentra comercios, servicios, propiedades y avisos en tu ciudad.",
};

/**
 * Cities Page - La Guía de Chile
 *
 * Displays all Chilean cities in a grid layout.
 * For cities organized by region, see /regiones.
 */
export default async function CitiesPage() {
  const [cities, totalCities] = await Promise.all([
    getAllCitiesFromRegions(),
    getTotalCitiesCount(),
  ]);

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Ciudades", href: "" },
  ];

  return (
    <LDCListingPageTemplate
      hero={
        <LDCListingsPageHero
          title="Ciudades de Chile"
          breadcrumbs={breadcrumbs}
          icon={MapPin}
        />
      }
    >
      <LDCSection paddingY="lg">
        {/* Link to regions */}
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mb-2">
            ¿Buscas ciudades organizadas por región?
          </p>
          <Link
            href="/regiones"
            className="text-pink dark:text-yellow hover:underline font-medium"
          >
            Ver todas las regiones de Chile →
          </Link>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cities.map((city) => (
            <LDCCityCard
              key={city.id}
              name={city.name}
              slug={city.slug}
              image={getCityImage(city.slug, city.id)}
              count={getMockCityCount(city.id)}
              aspectRatio="9/16"
            />
          ))}
        </div>
      </LDCSection>
    </LDCListingPageTemplate>
  );
}
