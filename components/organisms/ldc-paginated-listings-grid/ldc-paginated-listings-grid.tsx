"use client";

import { cn } from "@/lib/utils";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { LDCLoadMoreGrid } from "@/components/organisms/ldc-load-more-grid";
import { useLoadMore } from "@/hooks/use-load-more";
import { IFeaturedListings } from "@/interfaces/featured-listing";

interface LDCPaginatedListingsGridProps {
  /** Array of all listings */
  listings: IFeaturedListings;
  /** Number of items per page (default: 12) */
  itemsPerPage?: number;
  /** Number of columns on large screens (default: 5) */
  columns?: 3 | 4 | 5;
  /** Empty state message */
  emptyMessage?: string;
  /** Load more button label */
  loadMoreLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPaginatedListingsGrid - Paginated Grid of Listing Cards
 *
 * Client component that displays a paginated grid of listing cards
 * with a "Load More" button. Uses Framer Motion for smooth animations.
 *
 * @example
 * ```tsx
 * <LDCPaginatedListingsGrid
 *   listings={commerces}
 *   itemsPerPage={12}
 *   columns={4}
 *   loadMoreLabel="Cargar más comercios"
 * />
 * ```
 */
export function LDCPaginatedListingsGrid({
  listings,
  itemsPerPage = 15,
  columns = 5,
  emptyMessage = "No se encontraron resultados",
  loadMoreLabel = "Cargar más",
  className,
}: LDCPaginatedListingsGridProps) {
  const {
    visibleItems: visibleListings,
    visibleCount,
    hasMore,
    remainingCount,
    isLoading,
    loadMore,
  } = useLoadMore(listings, { pageSize: itemsPerPage });

  const columnClasses = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-3 xl:grid-cols-5",
  };

  if (listings.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <LDCEmptyState
          icon={
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          title={emptyMessage}
          description="Intenta ajustar los filtros o vuelve más tarde para ver nuevos resultados."
        />
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      <LDCLoadMoreGrid
        gridClassName={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-6 items-start",
          columnClasses[columns]
        )}
        visibleCount={visibleCount}
        pageSize={itemsPerPage}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
        loadMoreLabel={`${loadMoreLabel} (${remainingCount} restantes)`}
      >
        {visibleListings.map((listing) => (
          <LDCListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            slug={listing.slug}
            type={listing.type}
            category={listing.category}
            city={listing.city}
            image={listing.image}
            featured={listing.featured}
            createdAt={listing.createdAt}
            updatedAt={listing.updatedAt}
          />
        ))}
      </LDCLoadMoreGrid>
    </LDCSection>
  );
}
