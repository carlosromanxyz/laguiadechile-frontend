/**
 * Estados de una publicación en los listados admin (CLGDC-156): textos, badge y clave de `?estado=`.
 * Helpers puros: sin I/O ni React, seguros en server y client.
 */
import type { IAdminPublicationStatus } from "@/interfaces/admin-publication";
import { ADMIN_PUBLICATION_STATUSES } from "@/interfaces/admin-publication";

export const ADMIN_PUBLICATION_STATUS_META = {
  PUBLISHED: { key: "publicadas", label: "Publicada", pill: "Publicadas", badge: "status-published" },
  REVIEW: { key: "revision", label: "En revisión", pill: "En revisión", badge: "status-review" },
  REJECTED: { key: "rechazadas", label: "Rechazada", pill: "Rechazadas", badge: "status-rejected" },
  EXPIRED: { key: "vencidas", label: "Vencida", pill: "Vencidas", badge: "status-expired" },
  // Neutro, como «Vencida»: el dueño la sacó de la guía (CLGDC-157).
  ARCHIVED: { key: "archivadas", label: "Archivada", pill: "Archivadas", badge: "status-expired" },
} as const satisfies Record<
  IAdminPublicationStatus,
  { key: string; label: string; pill: string; badge: `status-${string}` }
>;

/** Clave de «Todos» en `?estado=` (no filtra; en la URL se omite). */
export const ADMIN_STATUS_ALL = "todos";

/** Estado de la API a partir de `?estado=`; `null` con «todos» o un valor desconocido. */
export function adminStatusFromKey(key: string | undefined): IAdminPublicationStatus | null {
  return ADMIN_PUBLICATION_STATUSES.find((s) => ADMIN_PUBLICATION_STATUS_META[s].key === key) ?? null;
}

export interface IAdminListSearchParams {
  q?: string | string[];
  ciudad?: string | string[];
  estado?: string | string[];
  page?: string | string[];
}

/** Filtros de la URL de un listado admin, ya saneados (`q` ≤ 200, `page` entre 1 y 10000). */
export function parseAdminListParams(params: IAdminListSearchParams) {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = first(params.q).trim().slice(0, 200);
  const city = first(params.ciudad).trim();
  const status = adminStatusFromKey(first(params.estado));
  const rawPage = Number.parseInt(first(params.page), 10);
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(rawPage, 1), 10000) : 1;
  return { q, city, status, page };
}
