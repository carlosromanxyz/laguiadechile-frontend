"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { LDCLoadMoreButton } from "@/components/molecules/ldc-load-more-button";
import { IFeaturedListings } from "@/interfaces/featured-listing";
import { motion, AnimatePresence } from "framer-motion";

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
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;
  const remainingCount = listings.length - visibleCount;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + itemsPerPage, listings.length));
      setIsLoading(false);
    }, 300);
  }, [itemsPerPage, listings.length]);

  const columnClasses = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-3 xl:grid-cols-5",
  };

  if (listings.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
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
          </div>
          <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground max-w-md">
            Intenta ajustar los filtros o vuelve más tarde para ver nuevos resultados.
          </p>
        </div>
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-6 items-start",
          columnClasses[columns]
        )}
      >
        <AnimatePresence mode="popLayout">
          {visibleListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index >= visibleCount - itemsPerPage ? (index % itemsPerPage) * 0.05 : 0,
              }}
            >
              <LDCListingCard
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <LDCLoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoading}
          label={`${loadMoreLabel} (${remainingCount} restantes)`}
          loadingLabel="Cargando..."
        />
      )}
    </LDCSection>
  );
}
