import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import { getRecentProperties } from "@/services/properties";

/**
 * LDCRecentProperties - Recent Properties Section
 *
 * Displays a grid of the most recent property listings.
 * Server Component that fetches recent properties sorted by creation date.
 *
 * @example
 * ```tsx
 * <LDCRecentProperties />
 * ```
 */
export async function LDCRecentProperties() {
  const properties = await getRecentProperties(10);

  return (
    <LDCSection>
      <LDCSectionHeader
        title="Propiedades recientes"
        subtitle="Descubre las últimas propiedades publicadas en Chile"
      />

      {/* Properties Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {properties.map((property) => (
          <LDCPropertyCard
            key={property.id}
            title={property.title}
            slug={property.slug}
            type={property.type}
            operation={property.operation}
            price={property.price}
            features={property.features}
            location={property.location}
            image={property.image}
            images={property.images}
            featured={property.featured}
            isNew={property.isNew}
          />
        ))}
      </div>
    </LDCSection>
  );
}
