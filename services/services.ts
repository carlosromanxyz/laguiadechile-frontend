import { IFeaturedListing, IFeaturedListings } from "@/interfaces/featured-listing";
import featuredListingsData from "@/data/featured-listings.json";

/**
 * Get all services (type: "servicio")
 * @returns Array of service listings
 */
export function getServices(): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "servicio"
  ) as IFeaturedListings;
}

/**
 * Get featured services only
 * @returns Array of featured service listings
 */
export function getFeaturedServices(): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "servicio" && listing.featured
  ) as IFeaturedListings;
}

/**
 * Get recent services sorted by creation date (most recent first)
 * @param limit - Number of listings to return (default: 12)
 * @returns Array of recent service listings
 */
export function getRecentServices(limit: number = 12): IFeaturedListings {
  return [...featuredListingsData]
    .filter((listing) => listing.type === "servicio")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit) as IFeaturedListings;
}

/**
 * Get service by slug
 * @param slug - Service slug
 * @returns Service listing or undefined
 */
export function getServiceBySlug(slug: string): IFeaturedListing | undefined {
  return featuredListingsData.find(
    (listing) => listing.type === "servicio" && listing.slug === slug
  ) as IFeaturedListing | undefined;
}

/**
 * Get services by category slug
 * @param categorySlug - Category slug
 * @returns Array of service listings in that category
 */
export function getServicesByCategory(categorySlug: string): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "servicio" && listing.category.slug === categorySlug
  ) as IFeaturedListings;
}

/**
 * Get services by city slug
 * @param citySlug - City slug
 * @returns Array of service listings in that city
 */
export function getServicesByCity(citySlug: string): IFeaturedListings {
  return featuredListingsData.filter(
    (listing) => listing.type === "servicio" && listing.city.slug === citySlug
  ) as IFeaturedListings;
}
