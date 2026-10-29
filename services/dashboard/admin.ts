import "server-only";
/**
 * Datos del inicio del administrador: conteos y noticias de la API pública, y la cola de
 * moderación (`GET /admin/moderation`, con la sesión del request).
 */
import { cache } from "react";
import type {
  IDashboardAdminCounts,
  IDashboardModerationItem,
  IDashboardNewsItem,
} from "@/interfaces/dashboard";
import { apiFetchServer } from "@/lib/api-client";
import { formatRelative } from "@/lib/dashboard/dates";

interface RawModerationItem {
  kind: "LISTING" | "CLASSIFIED";
  id: string;
  title: string;
  slug: string;
  image: string;
  updatedAt: string;
  owner: { name: string; email: string } | null;
  /** Tipo de la ficha (`COMERCIO` o `SERVICIO`); hoy la cola no lo trae y se asume comercio. */
  type?: string;
  /** Texto plano (el backend quita las etiquetas). */
  description: string;
}

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

/**
 * Cola de moderación: lo que comercios y usuarios enviaron o editaron, lo más antiguo primero.
 * Ante un error, lista vacía (el layout también la pide para el contador del menú).
 */
export const getModerationQueue = cache(async (): Promise<IDashboardModerationItem[]> => {
  const raw = await safeList<RawModerationItem>("/admin/moderation");
  const now = new Date();
  return raw.map((m) => {
    const kind = m.kind === "CLASSIFIED" ? "classified" : "listing";
    // El rol que da cada publicación: un aviso, avisador; una ficha, comercio o servicio.
    const role = kind === "classified" ? "avisador" : m.type === "SERVICIO" ? "servicio" : "comercio";
    return {
      id: m.id,
      kind,
      title: m.title,
      slug: m.slug,
      image: m.image,
      by: m.owner ? `${m.owner.name} · ${role}` : "Sin dueño",
      when: formatRelative(m.updatedAt, now),
      description: m.description,
    };
  });
});
