/**
 * Commerces service — backed by the NestJS API via the server-only DAL.
 */
export {
  getCommerces,
  getFeaturedCommerces,
  getRecentCommerces,
  getCommerceBySlug,
  getCommercesByCategory,
  getCommercesByCity,
} from "@/lib/api/listings";
