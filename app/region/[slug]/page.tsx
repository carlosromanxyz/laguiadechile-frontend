import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCCityCard } from "@/components/molecules/ldc-city-card";
import { getRegions, getRegionBySlug } from "@/services/regions";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface RegionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

/**
 * Generate static params for all regions
 */
export async function generateStaticParams() {
  const regions = getRegions();
  return regions.map((region) => ({
    slug: region.slug,
  }));
}

/**
 * Generate metadata for the region page
 */
export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegionBySlug(slug);

  if (!region) {
    return {
      title: "Región no encontrada - La Guía de Chile",
    };
  }

  return {
    title: `${region.name} - La Guía de Chile`,
    description: `Explora las ciudades de la ${region.name}. Encuentra comercios, servicios, propiedades y avisos.`,
  };
}

/**
 * Region Page - La Guía de Chile
 *
 * Displays all cities in a specific region with city cards.
 */
export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);

  if (!region) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Regiones", href: "/regiones" },
    { label: region.name, href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title={region.name}
        breadcrumbs={breadcrumbs}
        icon={MapPin}
      />

      {/* Main Content */}
      <main>
        <LDCSection paddingY="lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {region.cities.map((city) => (
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
