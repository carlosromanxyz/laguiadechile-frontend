import "server-only";
import type { IRegion, IRegions, IRegionCity } from "@/interfaces/region";
import type { ICategories } from "@/interfaces/category";
import type { ICities } from "@/interfaces/city";
import type { IFeaturedCategory, IFeaturedCategories } from "@/interfaces/featured-category";
import type { IFeaturedCity, IFeaturedCities } from "@/interfaces/featured-city";
import { apiGet, apiGetOrNull } from "./server-fetch";
import { mapFeaturedCategory, mapFeaturedCity } from "./mappers";

interface RawRegionCity {
  id: string;
  name: string;
  slug: string;
  isCapital: boolean;
}
interface RawRegion {
  id: string;
  name: string;
  slug: string;
  romanNumeral: string;
  cities?: RawRegionCity[];
}
interface RawCityFull {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isCapital?: boolean;
}
interface RawCatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

const mapRegionCity = (c: RawRegionCity): IRegionCity => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  isCapital: c.isCapital,
});
const mapRegion = (r: RawRegion): IRegion => ({
  id: r.id,
  name: r.name,
  romanNumeral: r.romanNumeral,
  slug: r.slug,
  cities: (r.cities ?? []).map(mapRegionCity),
});

// ---- Regions (services/regions.ts) ----
export async function getRegions(): Promise<IRegions> {
  return (await apiGet<RawRegion[]>(`/regions`)).map(mapRegion);
}

export async function getRegionBySlug(slug: string): Promise<IRegion | undefined> {
  const raw = await apiGetOrNull<RawRegion>(`/regions/${slug}`);
  return raw ? mapRegion(raw) : undefined;
}

export async function getAllCitiesFromRegions(): Promise<IRegionCity[]> {
  return (await getRegions()).flatMap((r) => r.cities);
}

export async function getCityBySlugFromRegions(
  slug: string,
): Promise<{ city: IRegionCity; region: IRegion } | undefined> {
  for (const region of await getRegions()) {
    const city = region.cities.find((c) => c.slug === slug);
    if (city) return { city, region };
  }
  return undefined;
}

export async function getTotalCitiesCount(): Promise<number> {
  return (await getRegions()).reduce((t, r) => t + r.cities.length, 0);
}

// ---- Categories / Cities (search-data.ts) ----
export async function getCategories(): Promise<ICategories> {
  const raw = await apiGet<RawCatalogCategory[]>(`/categories`);
  return raw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    icon: c.icon ?? undefined,
  }));
}

export async function getCities(): Promise<ICities> {
  const raw = await apiGet<RawCityFull[]>(`/cities`);
  return raw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
  }));
}

// ---- Featured categories (services/featured-categories.ts) ----
export async function getFeaturedCategories(): Promise<IFeaturedCategories> {
  const raw = await apiGet<Parameters<typeof mapFeaturedCategory>[0][]>(`/categories`);
  return raw.map(mapFeaturedCategory).filter((c) => c.featured);
}
export async function getAllCategoriesFull(): Promise<IFeaturedCategories> {
  const raw = await apiGet<Parameters<typeof mapFeaturedCategory>[0][]>(`/categories`);
  return raw.map(mapFeaturedCategory);
}
export async function getCategoryFullBySlug(slug: string): Promise<IFeaturedCategory | undefined> {
  const raw = await apiGetOrNull<Parameters<typeof mapFeaturedCategory>[0]>(`/categories/${slug}`);
  return raw ? mapFeaturedCategory(raw) : undefined;
}

// ---- Featured cities (services/featured-cities.ts) ----
export async function getFeaturedCities(limit = 5): Promise<IFeaturedCities> {
  const raw = await apiGet<Parameters<typeof mapFeaturedCity>[0][]>(`/cities`);
  return raw.map(mapFeaturedCity).filter((c) => c.featured).slice(0, limit);
}
export async function getAllCitiesFull(): Promise<IFeaturedCities> {
  const raw = await apiGet<Parameters<typeof mapFeaturedCity>[0][]>(`/cities`);
  return raw.map(mapFeaturedCity);
}
export async function getCityFullBySlug(slug: string): Promise<IFeaturedCity | undefined> {
  const raw = await apiGetOrNull<Parameters<typeof mapFeaturedCity>[0]>(`/cities/${slug}`);
  return raw ? mapFeaturedCity(raw) : undefined;
}
