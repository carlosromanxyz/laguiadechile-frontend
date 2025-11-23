import { IFeaturedListings } from "@/interfaces/featured-listing";
import featuredListingsData from "@/data/featured-listings.json";

/**
 * Get all featured listings for the home page
 * @returns Array of featured listings
 */
export function getFeaturedListings(): IFeaturedListings {
  return featuredListingsData as IFeaturedListings;
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
