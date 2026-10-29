"use client";

import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import { LDCLoadMoreGrid } from "@/components/organisms/ldc-load-more-grid";
import { useLoadMore } from "@/hooks/use-load-more";
import { IProperties } from "@/interfaces/property";
import { Home } from "lucide-react";

interface LDCPaginatedPropertiesGridProps {
  /** Array of all properties */
  properties: IProperties;
  /** Number of items per page (default: 9 for 3-column grid) */
  itemsPerPage?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Load more button label */
  loadMoreLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPaginatedPropertiesGrid - Paginated Grid of Property Cards
 *
 * Client component that displays a paginated 3-column grid of property cards
 * with a "Load More" button. Uses Framer Motion for smooth animations.
 *
 * @example
 * ```tsx
 * <LDCPaginatedPropertiesGrid
 *   properties={properties}
 *   itemsPerPage={9}
 *   loadMoreLabel="Cargar más propiedades"
 * />
 * ```
 */
export function LDCPaginatedPropertiesGrid({
  properties,
  itemsPerPage = 9,
  emptyMessage = "No se encontraron propiedades",
  loadMoreLabel = "Cargar más propiedades",
  className,
}: LDCPaginatedPropertiesGridProps) {
  const {
    visibleItems: visibleProperties,
    visibleCount,
    hasMore,
    remainingCount,
    isLoading,
    loadMore,
  } = useLoadMore(properties, { pageSize: itemsPerPage });

  if (properties.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <LDCEmptyState
          icon={<Home className="w-12 h-12 text-muted-foreground" />}
          title={emptyMessage}
          description="Intenta ajustar los filtros o vuelve más tarde para ver nuevas propiedades."
        />
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Mostrando {visibleProperties.length} de {properties.length} propiedades
      </p>

      {/* Properties grid - 4 columns on xl, items aligned at top */}
      <LDCLoadMoreGrid
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start"
        visibleCount={visibleCount}
        pageSize={itemsPerPage}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
        loadMoreLabel={`${loadMoreLabel} (${remainingCount} restantes)`}
      >
        {visibleProperties.map((property) => (
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
      </LDCLoadMoreGrid>
    </LDCSection>
  );
}
