import { ICategories } from "@/interfaces/category";
import { ICities } from "@/interfaces/city";
import categoriesData from "@/data/categories.json";
import citiesData from "@/data/cities.json";

/**
 * Get all categories for search form
 * @returns Array of categories
 */
export function getCategories(): ICategories {
  return categoriesData as ICategories;
}

/**
 * Get all cities for search form
 * @returns Array of cities
 */
export function getCities(): ICities {
  return citiesData as ICities;
}
