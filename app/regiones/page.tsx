import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import { LDCSection } from "@/components/organisms/ldc-section";
import { getRegions } from "@/services/regions";
import { MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
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
export default function RegionsPage() {
  const regions = getRegions();

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Regiones", href: "" },
  ];

  return (
    <>
      {/* Hero Section */}
      <LDCListingsPageHero
        title="Regiones de Chile"
        subtitle="Explora todas las regiones de Chile y descubre comercios, servicios, propiedades y avisos."
        breadcrumbs={breadcrumbs}
        icon={MapPin}
        count={regions.length}
      />

      {/* Main Content */}
      <main>
        <LDCSection paddingY="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regions.map((region) => (
              <Link
                key={region.id}
                href={`/region/${region.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card dark:bg-neutral-800/50 hover:border-pink dark:hover:border-yellow hover:shadow-lg transition-all duration-200"
              >
                {/* Roman numeral badge */}
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple/10 to-pink/10 dark:from-purple/20 dark:to-pink/20 flex-shrink-0">
                  <span className="text-sm font-bold text-purple">
                    {region.romanNumeral}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold font-mulish text-foreground group-hover:text-pink dark:group-hover:text-yellow transition-colors truncate">
                    {region.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {region.cities.length} {region.cities.length === 1 ? "ciudad" : "ciudades"}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-pink dark:group-hover:text-yellow transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </LDCSection>
      </main>
    </>
  );
}
