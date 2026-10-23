/**
 * Services (servicios) service — backed by the NestJS API via the server-only DAL.
 */
export {
  getServices,
  getFeaturedServices,
  getRecentServices,
  getServiceBySlug,
  getServicesByCategory,
  getServicesByCity,
} from "@/lib/api/listings";
