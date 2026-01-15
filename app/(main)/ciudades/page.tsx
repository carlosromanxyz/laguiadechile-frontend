import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCCityCard } from "@/components/molecules/ldc-city-card";
import { getAllCitiesFromRegions, getTotalCitiesCount } from "@/services/regions";
import { MapPin } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

/**
 * Generate a mock count based on city id for consistent display
 */
function getMockCityCount(cityId: number): number {
  const seed = cityId * 17 + 23;
  return (seed % 150) + 5;
}

/**
 * Generate a placeholder image URL for a city
 */
function getCityImage(citySlug: string, cityId: number): string {
  return `https://picsum.photos/seed/${citySlug}-${cityId}/800/600`;
}

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
export default function CitiesPage() {
  const cities = getAllCitiesFromRegions();
  const totalCities = getTotalCitiesCount();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Ciudades", href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title="Ciudades de Chile"
        breadcrumbs={breadcrumbs}
        icon={MapPin}
      />

      {/* Main Content */}
      <main>
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
      </main>
    </>
  );
}
