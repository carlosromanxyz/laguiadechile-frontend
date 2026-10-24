"use client";

import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import { LDCLoadMoreGrid } from "@/components/organisms/ldc-load-more-grid";
import { useLoadMore } from "@/hooks/use-load-more";
import { IClassifieds } from "@/interfaces/classified";
import { Search } from "lucide-react";

interface LDCPaginatedClassifiedsListProps {
  /** Array of all classifieds */
  classifieds: IClassifieds;
  /** Number of items per page (default: 10) */
  itemsPerPage?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Load more button label */
  loadMoreLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPaginatedClassifiedsList - Paginated List of Classified Cards
 *
 * Client component that displays a paginated list of horizontal classified cards
 * with a "Load More" button. Uses Framer Motion for smooth animations.
 *
 * @example
 * ```tsx
 * <LDCPaginatedClassifiedsList
 *   classifieds={classifieds}
 *   itemsPerPage={10}
 *   loadMoreLabel="Cargar más avisos"
 * />
 * ```
 */
export function LDCPaginatedClassifiedsList({
  classifieds,
  itemsPerPage = 10,
  emptyMessage = "No se encontraron avisos",
  loadMoreLabel = "Cargar más avisos",
  className,
}: LDCPaginatedClassifiedsListProps) {
  const {
    visibleItems: visibleClassifieds,
    visibleCount,
    hasMore,
    remainingCount,
    isLoading,
    loadMore,
  } = useLoadMore(classifieds, { pageSize: itemsPerPage });

  if (classifieds.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground max-w-md">
            Intenta ajustar los filtros o vuelve más tarde para ver nuevos avisos.
          </p>
        </div>
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Mostrando {visibleClassifieds.length} de {classifieds.length} avisos
      </p>

      {/* Classifieds list */}
      <LDCLoadMoreGrid
        gridClassName="space-y-4"
        visibleCount={visibleCount}
        pageSize={itemsPerPage}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
        loadMoreLabel={`${loadMoreLabel} (${remainingCount} restantes)`}
      >
        {visibleClassifieds.map((classified) => (
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
      </LDCLoadMoreGrid>
    </LDCSection>
  );
}
