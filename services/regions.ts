/**
 * Regions service — backed by the NestJS API via the server-only DAL.
 */
export {
  getRegions,
  getRegionBySlug,
  getAllCitiesFromRegions,
  getCityBySlugFromRegions,
  getTotalCitiesCount,
} from "@/lib/api/catalog";
