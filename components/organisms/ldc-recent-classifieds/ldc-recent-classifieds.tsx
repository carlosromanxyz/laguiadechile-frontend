import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import { getRecentClassifieds } from "@/services/classifieds";

/**
 * LDCRecentClassifieds - Recent Classifieds Section
 *
 * Displays a list of the most recent classified ads.
 * Server Component that fetches recent classifieds sorted by creation date.
 *
 * @example
 * ```tsx
 * <LDCRecentClassifieds />
 * ```
 */
export function LDCRecentClassifieds() {
  const classifieds = getRecentClassifieds(6);

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
