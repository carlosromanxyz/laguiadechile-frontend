import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import type { IProperties } from "@/interfaces/property";

interface LDCRecentPropertiesProps {
  properties: IProperties;
}

/**
 * LDCRecentProperties - Recent Properties Section
 *
 * Displays a grid of the most recent property listings.
 * Server Component: recibe los datos por props (los carga la home).
 *
 * @example
 * ```tsx
 * <LDCRecentProperties properties={properties} />
 * ```
 */
export function LDCRecentProperties({ properties }: LDCRecentPropertiesProps) {
  return (
    <LDCSection>
      <LDCSectionHeader
        title="Propiedades recientes"
        subtitle="Descubre las últimas propiedades publicadas en Chile"
      />

      {/* Properties Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {properties.map((property) => (
          <LDCPropertyCard
            key={property.id}
            id={property.id}
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
