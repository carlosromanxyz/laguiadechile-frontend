/**
 * Classifieds service — backed by the NestJS API via the server-only DAL.
 * Pure helpers live in `@/lib/format/classifieds` for Client Components.
 */
export {
  getClassifieds,
  getRecentClassifieds,
  getClassifiedBySlug,
  getClassifiedsByCity,
  getClassifiedSlugs,
  getRelatedClassifieds,
} from "@/lib/api/classifieds";

export { formatClassifiedPrice, getRelativeTime } from "@/lib/format/classifieds";
