import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { getRecentListings } from "@/services/featured-listings";

/**
 * LDCRecentListings - Recent Listings Section
 *
 * Displays a grid of the most recent business/service listings.
 * Server Component that fetches recent listings sorted by creation date.
 *
 * @example
 * ```tsx
 * <LDCRecentListings />
 * ```
 */
export function LDCRecentListings() {
  const listings = getRecentListings(10);

  return (
    <LDCSection>
      <LDCSectionHeader
        title="Publicaciones recientes"
        subtitle="Conoce lo más reciente en La Guía de Chile"
      />

      {/* Listings Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
