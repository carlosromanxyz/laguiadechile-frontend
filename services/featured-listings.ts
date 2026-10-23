/**
 * Featured/recent listings service — backed by the NestJS API via the DAL.
 * Pure helpers live in `@/lib/format/listings` for Client Components.
 */
export {
  getFeaturedListings,
  getRecentListings,
  getListingsByCategory,
  getListingsByCity,
} from "@/lib/api/listings";

export { isNewListing, isUpdatedListing } from "@/lib/format/listings";
