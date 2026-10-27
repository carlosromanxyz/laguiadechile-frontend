import "server-only";
/**
 * Datos del inicio del administrador: conteos y noticias reales de la API, y la cola de
 * moderación simulada (el backend aún no tiene envíos de comercios ni reportes).
 */
import type {
  IDashboardAdminCounts,
  IDashboardModerationItem,
  IDashboardNewsItem,
} from "@/interfaces/dashboard";
import { apiFetchServer } from "@/lib/api-client";
import { MOCK_MODERATION_QUEUE } from "@/lib/mock/dashboard/moderacion";

interface RawListingLite {
  featured?: boolean;
}
interface RawClassifiedLite {
  expiresAt?: string | null;
}
interface RawNewsLite {
  id: string;
  title: string;
  slug: string;
  image: string;
  publishedAt?: string | null;
  createdAt: string;
  authorName?: string | null;
}

/** Lista de la API; ante cualquier error, lista vacía (como el inicio anterior). */
async function safeList<T>(path: string): Promise<T[]> {
  try {
    const data = await apiFetchServer<unknown>(path);
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export async function getAdminOverview(): Promise<{
  counts: IDashboardAdminCounts;
  latestNews: IDashboardNewsItem[];
}> {
  const [listings, classifieds, properties, news, categories, cities, regions] =
    await Promise.all([
      safeList<RawListingLite>("/listings?limit=200"),
      safeList<RawClassifiedLite>("/classifieds?limit=200&includeExpired=true"),
      safeList<unknown>("/properties?limit=200"),
      safeList<RawNewsLite>("/news?limit=200"),
      safeList<unknown>("/categories?limit=200"),
      safeList<unknown>("/cities?limit=500"),
      safeList<unknown>("/regions?limit=50"),
    ]);

  const now = Date.now();
  const latestNews = [...news]
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime(),
    )
    .slice(0, 3)
    .map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      image: n.image,
      publishedAt: n.publishedAt ?? n.createdAt,
      authorName: n.authorName ?? "La Guía de Chile",
    }));

  return {
    counts: {
      listings: listings.length,
      listingsFeatured: listings.filter((l) => l.featured).length,
      classifieds: classifieds.length,
      classifiedsExpired: classifieds.filter(
        (c) => c.expiresAt != null && new Date(c.expiresAt).getTime() < now,
      ).length,
      properties: properties.length,
      news: news.length,
      categories: categories.length,
      cities: cities.length,
      regions: regions.length,
    },
    latestNews,
  };
}

/** Cola de moderación (simulada). */
export async function getModerationQueue(): Promise<IDashboardModerationItem[]> {
  return MOCK_MODERATION_QUEUE;
}
