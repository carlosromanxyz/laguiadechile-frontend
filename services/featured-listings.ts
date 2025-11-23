import { IFeaturedListings } from "@/interfaces/featured-listing";
import featuredListingsData from "@/data/featured-listings.json";

/**
 * Get all featured listings for the home page
 * @returns Array of featured listings
 */
export function getFeaturedListings(): IFeaturedListings {
  return featuredListingsData.filter((listing) => listing.featured) as IFeaturedListings;
}

/**
 * Get recent listings sorted by creation date (most recent first)
 * @param limit - Number of listings to return (default: 8)
 * @returns Array of recent listings
 */
export function getRecentListings(limit: number = 8): IFeaturedListings {
  return [...featuredListingsData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit) as IFeaturedListings;
}

/**
 * Check if a listing is "new" (created in the last 7 days)
 * @param createdAt - ISO date string
 * @returns boolean
 */
export function isNewListing(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays <= 7;
}

/**
 * Check if a listing was "recently updated" (updated in the last 7 days and different from creation)
 * @param createdAt - ISO date string
 * @param updatedAt - ISO date string
 * @returns boolean
 */
export function isUpdatedListing(createdAt: string, updatedAt: string): boolean {
  if (createdAt === updatedAt) return false;
  const updated = new Date(updatedAt);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays <= 7;
}
