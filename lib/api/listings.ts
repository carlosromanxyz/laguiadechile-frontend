import "server-only";
import type { IListingDetail, IListingDetails } from "@/interfaces/listing";
import { apiGet, apiGetOrNull, qs } from "./server-fetch";
import { mapListing, type RawListing } from "./mappers";

type ListType = "comercio" | "servicio";

async function fetchAll(
  params: Record<string, string | number | undefined> = {},
): Promise<IListingDetails> {
  const raw = await apiGet<RawListing[]>(`/listings${qs(params)}`);
  return raw.map(mapListing);
}

const byRecent = (a: IListingDetail, b: IListingDetail) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

// ---- Generic (services/listings.ts) ----
export async function getListings(
  type?: ListType,
): Promise<IListingDetails> {
  return fetchAll(type ? { type: type.toUpperCase() } : {});
}

export async function getListingBySlugAndType(
  slug: string,
  type: ListType,
): Promise<IListingDetail | null> {
  const raw = await apiGetOrNull<RawListing>(`/listings/${slug}`);
  if (!raw) return null;
  const mapped = mapListing(raw);
  return mapped.type === type ? mapped : null;
}

export async function getRelatedListings(
  currentId: string,
  categoryId: string,
  cityId: string,
  limit = 4,
): Promise<IListingDetails> {
  const all = await fetchAll();
  return all
    .filter((l) => l.id !== currentId && (l.category.id === categoryId || l.city.id === cityId))
    .slice(0, limit);
}

export async function getComercioSlugs(): Promise<{ slug: string }[]> {
  return (await fetchAll({ type: "COMERCIO" })).map((l) => ({ slug: l.slug }));
}

export async function getServicioSlugs(): Promise<{ slug: string }[]> {
  return (await fetchAll({ type: "SERVICIO" })).map((l) => ({ slug: l.slug }));
}

// ---- Featured/recent (services/featured-listings.ts) ----
export async function getFeaturedListings(limit = 10): Promise<IListingDetails> {
  return (await fetchAll({ featured: "true" })).slice(0, limit);
}

export async function getRecentListings(limit = 8): Promise<IListingDetails> {
  return (await fetchAll()).sort(byRecent).slice(0, limit);
}

export async function getListingsByCategory(categorySlug: string): Promise<IListingDetails> {
  return (await fetchAll()).filter((l) => l.category.slug === categorySlug);
}

export async function getListingsByCity(citySlug: string): Promise<IListingDetails> {
  return (await fetchAll()).filter((l) => l.city.slug === citySlug);
}

// ---- Commerces (services/commerces.ts) ----
export async function getCommerces(): Promise<IListingDetails> {
  return fetchAll({ type: "COMERCIO" });
}
export async function getFeaturedCommerces(): Promise<IListingDetails> {
  return fetchAll({ type: "COMERCIO", featured: "true" });
}
export async function getRecentCommerces(limit = 12): Promise<IListingDetails> {
  return (await fetchAll({ type: "COMERCIO" })).sort(byRecent).slice(0, limit);
}
export async function getCommerceBySlug(slug: string): Promise<IListingDetail | undefined> {
  return (await getListingBySlugAndType(slug, "comercio")) ?? undefined;
}
export async function getCommercesByCategory(categorySlug: string): Promise<IListingDetails> {
  return (await fetchAll({ type: "COMERCIO" })).filter((l) => l.category.slug === categorySlug);
}
export async function getCommercesByCity(citySlug: string): Promise<IListingDetails> {
  return (await fetchAll({ type: "COMERCIO" })).filter((l) => l.city.slug === citySlug);
}

// ---- Services (services/services.ts) ----
export async function getServices(): Promise<IListingDetails> {
  return fetchAll({ type: "SERVICIO" });
}
export async function getFeaturedServices(): Promise<IListingDetails> {
  return fetchAll({ type: "SERVICIO", featured: "true" });
}
export async function getRecentServices(limit = 12): Promise<IListingDetails> {
  return (await fetchAll({ type: "SERVICIO" })).sort(byRecent).slice(0, limit);
}
export async function getServiceBySlug(slug: string): Promise<IListingDetail | undefined> {
  return (await getListingBySlugAndType(slug, "servicio")) ?? undefined;
}
export async function getServicesByCategory(categorySlug: string): Promise<IListingDetails> {
  return (await fetchAll({ type: "SERVICIO" })).filter((l) => l.category.slug === categorySlug);
}
export async function getServicesByCity(citySlug: string): Promise<IListingDetails> {
  return (await fetchAll({ type: "SERVICIO" })).filter((l) => l.city.slug === citySlug);
}
