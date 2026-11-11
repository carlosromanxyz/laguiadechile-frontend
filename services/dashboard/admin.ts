import "server-only";
/**
 * Datos del inicio del administrador: conteos y noticias de la API pública, y la cola de
 * moderación (`GET /admin/moderation`, con la sesión del request).
 */
import { cache } from "react";
import type {
  IDashboardAdminCounts,
  IDashboardModerationItem,
  IDashboardModerationKind,
  IDashboardNewsItem,
} from "@/interfaces/dashboard";
import { apiFetchServer } from "@/lib/api-client";
import { LDC_ROLE_META, type LDCRole } from "@/lib/auth/roles";
import { formatRelative } from "@/lib/dashboard/dates";
import { formatPersonName } from "@/lib/people";

interface RawModerationItem {
  kind: "LISTING" | "CLASSIFIED" | "EVENT" | "PROPERTY" | "PLACE";
  id: string;
  title: string;
  slug: string;
  image: string;
  updatedAt: string;
  /** `null` si el dueño se borró. `roles`: todos los del dueño (enum `Role` del backend). */
  owner: { firstName: string; lastName: string; email: string; roles: string[] } | null;
  /** Tipo de la ficha (`COMERCIO` o `SERVICIO`); solo en `LISTING`. */
  type?: "COMERCIO" | "SERVICIO";
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
 * Cola de moderación: fichas, avisos, eventos, propiedades y lugares enviados o editados, lo más antiguo primero.
 * Ante un error, lista vacía (el layout también la pide para el contador del menú).
 */
export const getModerationQueue = cache(async (): Promise<IDashboardModerationItem[]> => {
  const raw = await safeList<RawModerationItem>("/admin/moderation");
  const now = new Date();
  return raw.map((m) => {
    const kind: IDashboardModerationKind =
      m.kind === "CLASSIFIED"
        ? "classified"
        : m.kind === "EVENT"
          ? "event"
          : m.kind === "PROPERTY"
            ? "property"
            : m.kind === "PLACE"
              ? "place"
              : "listing";
    const listingType =
      kind !== "listing" ? undefined
      : m.type === "SERVICIO" ? "servicio"
      : m.type === "COMERCIO" ? "comercio"
      : undefined;
    // Se muestra el rol que da la publicación (ficha → comercio o servicio según su tipo, aviso →
    // avisador, evento → organizador, propiedad → propietario, lugar → colaborador), aunque el dueño no lo tenga en
    // `owner.roles`.
    const role: LDCRole | undefined =
      kind === "classified"
        ? "avisador"
        : kind === "event"
          ? "organizador"
          : kind === "property"
            ? "propietario"
            : kind === "place"
              ? "colaborador"
              : listingType;
    return {
      id: m.id,
      kind,
      listingType,
      title: m.title,
      slug: m.slug,
      image: m.image,
      by: m.owner
        ? role
          ? `${formatPersonName(m.owner)} · ${LDC_ROLE_META[role].label}`
          : formatPersonName(m.owner)
        : "Sin dueño",
      when: formatRelative(m.updatedAt, now),
      description: m.description,
    };
  });
});
