import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import type { IClassifieds } from "@/interfaces/classified";

interface LDCRecentClassifiedsProps {
  classifieds: IClassifieds;
}

/**
 * LDCRecentClassifieds - Recent Classifieds Section
 *
 * Displays a list of the most recent classified ads.
 * Server Component: recibe los datos por props (los carga la home).
 *
 * @example
 * ```tsx
 * <LDCRecentClassifieds classifieds={classifieds} />
 * ```
 */
export function LDCRecentClassifieds({ classifieds }: LDCRecentClassifiedsProps) {
  return (
    <LDCSection>
      <LDCSectionHeader
        title="Avisos recientes"
        subtitle="Los últimos avisos clasificados publicados en Chile"
      />

      {/* Classifieds List */}
      <div className="space-y-4">
        {classifieds.map((classified) => (
          <LDCClassifiedCard
            key={classified.id}
            title={classified.title}
            slug={classified.slug}
            type={classified.type}
            category={classified.category}
            city={classified.city}
            commune={classified.commune}
            image={classified.image}
            price={classified.price}
            featured={classified.featured}
            createdAt={classified.createdAt}
          />
        ))}
      </div>
    </LDCSection>
  );
}
