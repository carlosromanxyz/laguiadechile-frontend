import { IRegion, IRegions, IRegionCity } from "@/interfaces/region";
import regionsData from "@/data/regions.json";
import { getListingsByCity } from "@/services/featured-listings";
import { getPropertiesByCity } from "@/services/properties";
import { getClassifiedsByCity } from "@/services/classifieds";

/**
 * Get all regions
 * @returns Array of all regions with their cities
 */
export function getRegions(): IRegions {
  return regionsData as IRegions;
}

/**
 * Get region by slug
 * @param slug - Region slug
 * @returns Region or undefined
 */
export function getRegionBySlug(slug: string): IRegion | undefined {
  return regionsData.find((region) => region.slug === slug) as IRegion | undefined;
}

/**
 * Get all cities from all regions
 * @returns Flat array of all cities
 */
export function getAllCitiesFromRegions(): IRegionCity[] {
  return regionsData.flatMap((region) => region.cities);
}

/**
 * Get city by slug from any region
 * @param slug - City slug
 * @returns City and its region, or undefined
 */
export function getCityBySlugFromRegions(
  slug: string
): { city: IRegionCity; region: IRegion } | undefined {
  for (const region of regionsData) {
    const city = region.cities.find((c) => c.slug === slug);
    if (city) {
      return { city, region: region as IRegion };
    }
  }
  return undefined;
}

/**
 * Get count of all content in a city (listings + properties + classifieds)
 * @param citySlug - City slug
 * @returns Total count of content
 */
export function getCityContentCount(citySlug: string): number {
  const listings = getListingsByCity(citySlug);
  const properties = getPropertiesByCity(citySlug);
  const classifieds = getClassifiedsByCity(citySlug);
  return listings.length + properties.length + classifieds.length;
}

/**
 * Get total count of all cities
 * @returns Total number of cities
 */
export function getTotalCitiesCount(): number {
  return regionsData.reduce((total, region) => total + region.cities.length, 0);
}
