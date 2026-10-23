/**
 * Featured cities service — backed by the NestJS API via the DAL.
 * Pure helper lives in `@/lib/format/cities` for Client Components.
 */
export {
  getFeaturedCities,
  getAllCitiesFull as getAllCities,
  getCityFullBySlug as getCityBySlug,
} from "@/lib/api/catalog";

export { formatPublicationsCount } from "@/lib/format/cities";
