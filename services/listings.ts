/**
 * Listings service — backed by the NestJS API via the server-only DAL.
 */
export {
  getListings,
  getListingBySlugAndType,
  getRelatedListings,
  getComercioSlugs,
  getServicioSlugs,
} from "@/lib/api/listings";
