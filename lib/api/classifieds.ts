import "server-only";
import type { IClassified, IClassifieds } from "@/interfaces/classified";
import { apiGet, apiGetOrNull, qs } from "./server-fetch";
import { mapClassified, type RawClassified } from "./mappers";

async function fetchAll(params: Record<string, string | number | undefined> = {}): Promise<IClassifieds> {
  // Dummy data carries past expiry dates; show expired ads too so the demo lists them.
  const raw = await apiGet<RawClassified[]>(`/classifieds${qs({ includeExpired: "true", ...params })}`);
  return raw.map(mapClassified);
}

export async function getClassifieds(): Promise<IClassifieds> {
  return fetchAll();
}

export async function getRecentClassifieds(limit = 12): Promise<IClassifieds> {
  const all = await fetchAll();
  return [...all]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getClassifiedBySlug(slug: string): Promise<IClassified | undefined> {
  const raw = await apiGetOrNull<RawClassified>(`/classifieds/${slug}`);
  return raw ? mapClassified(raw) : undefined;
}

export async function getClassifiedsByCity(citySlug: string): Promise<IClassifieds> {
  return (await fetchAll()).filter((c) => c.city.slug === citySlug);
}

export async function getClassifiedSlugs(): Promise<{ slug: string }[]> {
  return (await fetchAll()).map((c) => ({ slug: c.slug }));
}

export async function getRelatedClassifieds(
  currentId: string,
  categoryId: string,
  cityId: string,
  limit = 4,
): Promise<IClassifieds> {
  const all = await fetchAll();
  return all
    .filter((c) => c.id !== currentId && (c.category.id === categoryId || c.city.id === cityId))
    .slice(0, limit);
}
