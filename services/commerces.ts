import { IFeaturedListing, IFeaturedListings } from "@/interfaces/featured-listing";
import featuredListingsData from "@/data/featured-listings.json";

/**
 * Get all commerces (type: "comercio")
 * @returns Array of commerce listings
 */
export function getCommerces(): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "comercio"
  ) as IFeaturedListings;
}

/**
 * Get featured commerces only
 * @returns Array of featured commerce listings
 */
export function getFeaturedCommerces(): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "comercio" && listing.featured
  ) as IFeaturedListings;
}

/**
 * Get recent commerces sorted by creation date (most recent first)
 * @param limit - Number of listings to return (default: 12)
 * @returns Array of recent commerce listings
 */
export function getRecentCommerces(limit: number = 12): IFeaturedListings {
  return [...featuredListingsData]
    .filter((listing) => listing.type === "comercio")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit) as IFeaturedListings;
}

/**
 * Get commerce by slug
 * @param slug - Commerce slug
 * @returns Commerce listing or undefined
 */
export function getCommerceBySlug(slug: string): IFeaturedListing | undefined {
  return featuredListingsData.find(
    (listing) => listing.type === "comercio" && listing.slug === slug
  ) as IFeaturedListing | undefined;
}

/**
 * Get commerces by category slug
 * @param categorySlug - Category slug
 * @returns Array of commerce listings in that category
 */
export function getCommercesByCategory(categorySlug: string): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "comercio" && listing.category.slug === categorySlug
  ) as IFeaturedListings;
}

/**
 * Get commerces by city slug
 * @param citySlug - City slug
 * @returns Array of commerce listings in that city
 */
export function getCommercesByCity(citySlug: string): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "comercio" && listing.city.slug === citySlug
  ) as IFeaturedListings;
}
