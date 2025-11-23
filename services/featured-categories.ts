import { IFeaturedCategories } from "@/interfaces/featured-category";
import featuredCategoriesData from "@/data/featured-categories.json";

/**
 * Get all featured categories for the home page
 * @returns Array of featured categories
 */
export function getFeaturedCategories(): IFeaturedCategories {
  return featuredCategoriesData as IFeaturedCategories;
}
