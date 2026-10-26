import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCListingPageTemplate } from "@/components/templates/ldc-listing-page-template";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCRegionCard } from "@/components/molecules/ldc-region-card";
import { getRegions } from "@/services/regions";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regiones de Chile - La Guía de Chile",
  description:
    "Explora todas las regiones de Chile. Encuentra comercios, servicios, propiedades y avisos en cada región.",
};

/**
 * Regions Page - La Guía de Chile
 *
 * Displays all 16 Chilean regions as cards.
 * Each region links to its dedicated page showing its cities.
 */
export default async function RegionsPage() {
  const regions = await getRegions();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Regiones", href: "" },
  ];

  return (
    <LDCListingPageTemplate
      hero={
        <LDCListingsPageHero
          title="Regiones de Chile"
          breadcrumbs={breadcrumbs}
          icon={MapPin}
        />
      }
    >
      <LDCSection paddingY="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {regions.map((region) => (
            <LDCRegionCard
              key={region.id}
              name={region.name}
              slug={region.slug}
              romanNumeral={region.romanNumeral}
              citiesCount={region.cities.length}
            />
          ))}
        </div>
      </LDCSection>
    </LDCListingPageTemplate>
  );
}
