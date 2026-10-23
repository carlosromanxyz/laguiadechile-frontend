/**
 * Featured categories service — backed by the NestJS API via the DAL.
 */
export {
  getFeaturedCategories,
  getAllCategoriesFull as getAllCategories,
  getCategoryFullBySlug as getCategoryBySlug,
} from "@/lib/api/catalog";
