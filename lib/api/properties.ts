import "server-only";
import type { IProperty, IProperties, PropertyType } from "@/interfaces/property";
import { apiGet, apiGetOrNull, qs } from "./server-fetch";
import { mapProperty, type RawProperty } from "./mappers";

async function fetchAll(params: Record<string, string | number | undefined> = {}): Promise<IProperties> {
  const raw = await apiGet<RawProperty[]>(`/properties${qs(params)}`);
  return raw.map(mapProperty);
}

export async function getProperties(): Promise<IProperties> {
  return fetchAll();
}

export async function getRecentProperties(limit = 12): Promise<IProperties> {
  const all = await fetchAll();
  return [...all]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<IProperty | undefined> {
  const raw = await apiGetOrNull<RawProperty>(`/properties/${slug}`);
  return raw ? mapProperty(raw) : undefined;
}

export async function getPropertiesByCity(citySlug: string): Promise<IProperties> {
  return (await fetchAll()).filter((p) => p.location.city.slug === citySlug);
}

export async function getPropertySlugs(): Promise<{ slug: string }[]> {
  return (await fetchAll()).map((p) => ({ slug: p.slug }));
}

export async function getRelatedProperties(
  currentSlug: string,
  citySlug: string,
  type: PropertyType,
  limit = 4,
): Promise<IProperties> {
  const all = await fetchAll();
  return all
    .filter((p) => p.slug !== currentSlug && (p.location.city.slug === citySlug || p.type === type))
    .slice(0, limit);
}
