import "server-only";
/**
 * Datos del panel del rol Usuario, desde la API con la sesión del request (`apiFetchServer`):
 * sus avisos (`GET /me/classifieds`) y sus favoritos (`GET /me/favorites`).
 *
 * Ante un error de la API, listas vacías: el layout del panel también pide el contador del
 * menú y no debe caerse por eso.
 */
import { cache } from "react";
import type { IClassified } from "@/interfaces/classified";
import type {
  IDashboardFavorite,
  IDashboardFavoriteKind,
  IDashboardOwned,
} from "@/interfaces/dashboard";
import { apiFetchServer } from "@/lib/api-client";
import { mapClassified, type RawClassified, type RawListing } from "@/lib/api/mappers";
import { apiGetOrNull } from "@/lib/api/server-fetch";
import { toPublicationStatus } from "@/lib/dashboard/status";

type RawMyClassified = RawClassified & { status: string; rejectionReason?: string | null };

interface RawFavorite {
  kind: IDashboardFavoriteKind;
  targetId: string;
  createdAt: string;
  title: string;
  slug: string;
  image: string;
  city: { name: string; slug: string } | null;
}

async function safeList<T>(path: string): Promise<T[]> {
  try {
    const data = await apiFetchServer<unknown>(path);
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

const fetchMyClassifieds = cache(() => safeList<RawMyClassified>("/me/classifieds"));

/**
 * Avisos de la cuenta con su estado (un PUBLISHED con `expiresAt` pasado cuenta como vencido) y,
 * si fue rechazado, el motivo. `GET /me/classifieds` exige AVISADOR: sin ese rol, lista vacía.
 */
export async function getMyClassifieds(): Promise<IDashboardOwned<IClassified>[]> {
  const now = Date.now();
  return (await fetchMyClassifieds()).map((c) => {
    const status = toPublicationStatus(c.status, c.expiresAt, now);
    const reason = status === "rejected" ? c.rejectionReason?.trim() : undefined;
    return {
      item: mapClassified(c),
      ownership: { status, visits30d: null, ...(reason ? { rejectionReason: reason } : {}) },
    };
  });
}

/**
 * Comercio o servicio: el favorito no trae el `type` del listing, así que se lee la ficha
 * pública (`GET /listings/:slug`, con caché ISR). Si no se puede, cae en `/comercio/`.
 */
async function listingRoute(slug: string): Promise<{ label: string; base: string }> {
  try {
    const l = await apiGetOrNull<Pick<RawListing, "type">>(`/listings/${encodeURIComponent(slug)}`);
    if (l?.type === "SERVICIO") return { label: "Servicio", base: "/servicio" };
  } catch {
    // ficha no disponible: ruta de comercio por defecto
  }
  return { label: "Comercio", base: "/comercio" };
}

const ROUTES: Record<Exclude<IDashboardFavoriteKind, "LISTING">, { label: string; base: string }> = {
  CLASSIFIED: { label: "Aviso", base: "/aviso" },
  PROPERTY: { label: "Propiedad", base: "/propiedad" },
  NEWS: { label: "Noticia", base: "/noticia" },
};

/** Favoritos del usuario, del más reciente al más antiguo, con su enlace público. */
export const getMyFavorites = cache(async (): Promise<IDashboardFavorite[]> => {
  const raw = await safeList<RawFavorite>("/me/favorites");
  return Promise.all(
    raw.map(async (f) => {
      const route = f.kind === "LISTING" ? await listingRoute(f.slug) : ROUTES[f.kind];
      return {
        id: `${f.kind}:${f.targetId}`,
        kindKey: f.kind,
        targetId: f.targetId,
        kind: route?.label ?? "Favorito",
        title: f.title,
        place: f.city?.name ?? "",
        image: f.image,
        href: route ? `${route.base}/${f.slug}` : "/",
      };
    }),
  );
});

/** Avisos que piden acción (vencidos y rechazados): contador del menú «Mis avisos». */
export async function getMyClassifiedsPendingCount(): Promise<number> {
  const now = Date.now();
  return (await fetchMyClassifieds()).filter((c) => {
    const status = toPublicationStatus(c.status, c.expiresAt, now);
    return status === "expired" || status === "rejected";
  }).length;
}
