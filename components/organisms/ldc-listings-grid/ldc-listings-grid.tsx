import { cn } from "@/lib/utils";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { IFeaturedListings } from "@/interfaces/featured-listing";

interface LDCListingsGridProps {
  /** Array of listings to display */
  listings: IFeaturedListings;
  /** Optional className for custom styling */
  className?: string;
  /** Number of columns on large screens (default: 4) */
  columns?: 3 | 4;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * LDCListingsGrid - Responsive Grid of Listing Cards
 *
 * Displays a grid of listing cards with responsive column layout.
 * Includes empty state handling.
 *
 * @example
 * ```tsx
 * <LDCListingsGrid
 *   listings={commerces}
 *   columns={4}
 *   emptyMessage="No se encontraron comercios"
 * />
 * ```
 */
export function LDCListingsGrid({
  listings,
  className,
  columns = 4,
  emptyMessage = "No se encontraron resultados",
}: LDCListingsGridProps) {
  const columnClasses = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
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
          "grid grid-cols-1 sm:grid-cols-2 gap-6",
          columnClasses[columns]
        )}
      >
        {listings.map((listing) => (
          <LDCListingCard
            key={listing.id}
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
      </div>
    </LDCSection>
  );
}
