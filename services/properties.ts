/**
 * Properties service — backed by the NestJS API via the server-only DAL.
 * Pure helpers live in `@/lib/format/properties` for Client Components.
 */
export {
  getProperties,
  getRecentProperties,
  getPropertyBySlug,
  getPropertiesByCity,
  getPropertySlugs,
  getRelatedProperties,
} from "@/lib/api/properties";

export {
  formatPropertyPrice,
  formatPropertyPriceWithPeriod,
  formatCommonExpenses,
  getPropertyTypeLabel,
  getOperationLabel,
} from "@/lib/format/properties";
