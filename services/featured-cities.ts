import featuredCitiesData from "@/data/featured-cities.json";
import { IFeaturedCity, IFeaturedCities } from "@/interfaces/featured-city";

/**
 * Get featured cities
 * @param limit - Number of cities to return (default: 5)
 * @returns Array of featured cities
 */
export function getFeaturedCities(limit: number = 5): IFeaturedCities {
  return featuredCitiesData
    .filter((city) => city.featured)
    .slice(0, limit) as IFeaturedCities;
}

/**
 * Get all cities
 * @returns Array of all cities
 */
export function getAllCities(): IFeaturedCities {
  return featuredCitiesData as IFeaturedCities;
}

/**
 * Get city by slug
 * @param slug - City slug
 * @returns City object or undefined
 */
export function getCityBySlug(slug: string): IFeaturedCity | undefined {
  return featuredCitiesData.find((city) => city.slug === slug) as IFeaturedCity | undefined;
}

/**
 * Format publications count text in Spanish
 * @param count - Number of publications
 * @returns Formatted text
 */
export function formatPublicationsCount(count: number): string {
  if (count === 0) return "No hay publicaciones";
  if (count === 1) return "Una publicación";
  return `${count.toLocaleString("es-CL")} publicaciones`;
}
