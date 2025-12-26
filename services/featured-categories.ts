import { IFeaturedCategory, IFeaturedCategories } from "@/interfaces/featured-category";
import featuredCategoriesData from "@/data/featured-categories.json";

/**
 * Get all featured categories for the home page
 * @returns Array of featured categories
 */
export function getFeaturedCategories(): IFeaturedCategories {
  return featuredCategoriesData as IFeaturedCategories;
}

/**
 * Get all categories
 * @returns Array of all categories
 */
export function getAllCategories(): IFeaturedCategories {
  return featuredCategoriesData as IFeaturedCategories;
}

/**
 * Get category by slug
 * @param slug - Category slug
 * @returns Category object or undefined
 */
export function getCategoryBySlug(slug: string): IFeaturedCategory | undefined {
  return featuredCategoriesData.find(
    (category) => category.slug === slug
  ) as IFeaturedCategory | undefined;
}
