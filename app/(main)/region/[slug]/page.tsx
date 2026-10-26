import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCListingPageTemplate } from "@/components/templates/ldc-listing-page-template";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCCityCard } from "@/components/molecules/ldc-city-card";
import { getRegions, getRegionBySlug } from "@/services/regions";
import { getCityImage, getMockCityCount } from "@/lib/format/cities";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface RegionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all regions
 */
export async function generateStaticParams() {
  const regions = await getRegions();
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
  const region = await getRegionBySlug(slug);

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
  const region = await getRegionBySlug(slug);

  if (!region) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Regiones", href: "/regiones" },
    { label: region.name, href: "" },
  ];

  return (
    <LDCListingPageTemplate
      hero={
        <LDCListingsPageHero
          title={region.name}
          breadcrumbs={breadcrumbs}
          icon={MapPin}
        />
      }
    >
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
    </LDCListingPageTemplate>
  );
}
