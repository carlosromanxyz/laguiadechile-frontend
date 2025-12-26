import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { getFeaturedListings } from "@/services/featured-listings";

/**
 * LDCFeaturedListings - Featured Listings Section
 *
 * Displays a grid of featured business/service listings on the home page.
 * Server Component that fetches listing data from JSON.
 *
 * Features:
 * - Responsive grid layout (1 → 2 → 4 columns)
 * - Image optimization with Next.js Image
 * - Dynamic badges (Featured, New, Updated)
 * - Hover effects on cards
 *
 * @example
 * ```tsx
 * <LDCFeaturedListings />
 * ```
 */
export function LDCFeaturedListings() {
  const listings = getFeaturedListings();

  return (
    <LDCSection>
      <LDCSectionHeader
        title="Publicaciones destacadas"
        subtitle="Conoce lo más destacado de La Guía de Chile"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
