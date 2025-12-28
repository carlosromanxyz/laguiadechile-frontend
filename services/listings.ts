import { IListingDetail, IListingDetails } from "@/interfaces/listing";
import listingsData from "@/data/listings.json";

const listings = listingsData as IListingDetails;

/**
 * Get a listing by its slug
 * @param slug - The listing slug
 * @returns The listing detail or null if not found
 */
export function getListingBySlug(slug: string): IListingDetail | null {
  return listings.find((listing) => listing.slug === slug) || null;
}

/**
 * Get a listing by its slug and type
 * @param slug - The listing slug
 * @param type - The listing type (comercio or servicio)
 * @returns The listing detail or null if not found
 */
export function getListingBySlugAndType(
  slug: string,
  type: "comercio" | "servicio"
): IListingDetail | null {
  return (
    listings.find((listing) => listing.slug === slug && listing.type === type) ||
    null
  );
}

/**
 * Get all listings
 * @returns Array of all listings
 */
export function getAllListings(): IListingDetails {
  return listings;
}

/**
 * Get listings by type
 * @param type - The listing type (comercio or servicio)
 * @returns Array of listings of the specified type
 */
export function getListingsByType(
  type: "comercio" | "servicio"
): IListingDetails {
  return listings.filter((listing) => listing.type === type);
}

/**
 * Get featured listings
 * @param limit - Maximum number of listings to return
 * @returns Array of featured listings
 */
export function getFeaturedListings(limit: number = 10): IListingDetails {
  return listings.filter((listing) => listing.featured).slice(0, limit);
}

/**
 * Get related listings (same category or city, excluding current)
 * @param currentId - The current listing ID to exclude
 * @param categoryId - The category ID to match
 * @param cityId - The city ID to match
 * @param limit - Maximum number of listings to return
 * @returns Array of related listings
 */
export function getRelatedListings(
  currentId: number,
  categoryId: number,
  cityId: number,
  limit: number = 4
): IListingDetails {
  return listings
    .filter(
      (listing) =>
        listing.id !== currentId &&
        (listing.category.id === categoryId || listing.city.id === cityId)
    )
    .slice(0, limit);
}

/**
 * Get all listing slugs for static generation
 * @returns Array of slug objects for generateStaticParams
 */
export function getAllListingSlugs(): { slug: string }[] {
  return listings.map((listing) => ({ slug: listing.slug }));
}

/**
 * Get all comercio slugs for static generation
 * @returns Array of slug objects for generateStaticParams
 */
export function getComercioSlugs(): { slug: string }[] {
  return listings
    .filter((listing) => listing.type === "comercio")
    .map((listing) => ({ slug: listing.slug }));
}

/**
 * Get all servicio slugs for static generation
 * @returns Array of slug objects for generateStaticParams
 */
export function getServicioSlugs(): { slug: string }[] {
  return listings
    .filter((listing) => listing.type === "servicio")
    .map((listing) => ({ slug: listing.slug }));
}
