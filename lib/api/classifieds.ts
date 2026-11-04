import "server-only";
import type { IClassified, IClassifieds } from "@/interfaces/classified";
import { apiGet, apiGetNoStore, apiGetOrNull, qs } from "./server-fetch";
import { SEARCH_LIMIT, SEARCH_TERM_MAX_LENGTH } from "./listings";
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

/**
 * Avisos publicados y vigentes que coinciden con la búsqueda de `/resultados` (CLGDC-189). El backend
 * busca en el título y la descripción sin distinguir tildes ni mayúsculas, filtra por categoría y
 * ciudad (ids) y, sin `includeExpired`, deja fuera los vencidos. Sin data cache (`apiGetNoStore`):
 * el término es texto libre.
 */
export async function searchClassifieds(filters: {
  term?: string;
  categoryId?: string;
  cityId?: string;
}): Promise<IClassifieds> {
  const raw = await apiGetNoStore<RawClassified[]>(
    `/classifieds${qs({
      search: filters.term?.slice(0, SEARCH_TERM_MAX_LENGTH),
      categoryId: filters.categoryId,
      cityId: filters.cityId,
      limit: SEARCH_LIMIT,
    })}`,
  );
  return raw.map(mapClassified);
}
