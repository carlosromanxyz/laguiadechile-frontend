import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCCityCard } from "@/components/molecules/ldc-city-card";
import { getFeaturedCities } from "@/services/featured-cities";

/**
 * LDCFeaturedCities - Featured Cities Section
 *
 * Displays a grid of featured Chilean cities with images and publication counts.
 * Server Component that fetches featured cities data.
 *
 * @example
 * ```tsx
 * <LDCFeaturedCities />
 * ```
 */
export async function LDCFeaturedCities() {
  const cities = await getFeaturedCities();

  return (
    <LDCSection>
      <LDCSectionHeader
        title="Ciudades destacadas"
        subtitle="Conoce lo que hay en las ciudades más destacadas de Chile"
      />

      {/* Cities Grid */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-5">
        {cities.map((city) => (
          <LDCCityCard
            key={city.id}
            name={city.name}
            slug={city.slug}
            image={city.image}
            count={city.count}
            aspectRatio="9/16"
          />
        ))}
      </div>
    </LDCSection>
  );
}
