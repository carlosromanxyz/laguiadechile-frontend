/**
 * Estado de una publicación en el panel admin (`PublicationStatus` de la API, CLGDC-120).
 * `ARCHIVED` (CLGDC-157) lo pone el dueño: el admin lo ve y lo filtra, pero no lo asigna ni lo cambia.
 */
export type IAdminPublicationStatus = "PUBLISHED" | "REVIEW" | "REJECTED" | "EXPIRED" | "ARCHIVED";

/** Estados en el orden de los filtros. */
export const ADMIN_PUBLICATION_STATUSES = [
  "PUBLISHED",
  "REVIEW",
  "REJECTED",
  "EXPIRED",
  "ARCHIVED",
] as const satisfies readonly IAdminPublicationStatus[];

/** Estados que el admin puede asignar (menú «Cambiar estado»); `ARCHIVED` no (la API responde 400). */
export const ADMIN_SETTABLE_STATUSES = [
  "PUBLISHED",
  "REVIEW",
  "REJECTED",
  "EXPIRED",
] as const satisfies readonly IAdminPublicationStatus[];

export type IAdminSettableStatus = (typeof ADMIN_SETTABLE_STATUSES)[number];

/** Tipo de ficha (`ListingType` de la API). */
export type IAdminListingType = "COMERCIO" | "SERVICIO";

/** Fila de `GET /admin/listings`: sin descripción, con dueño y motivo del rechazo. */
export interface IAdminListingRow {
  id: string;
  title: string;
  slug: string;
  type: IAdminListingType;
  image: string;
  featured: boolean;
  status: IAdminPublicationStatus;
  /** Texto plano que escribió el equipo; solo con `REJECTED`. */
  rejectionReason: string | null;
  updatedAt: string;
  category: { id: string; name: string; slug: string };
  city: { id: string; name: string; slug: string };
  owner: { id: string; name: string } | null;
}

/**
 * Página de un listado admin con los conteos por estado (con los mismos filtros, sin el de estado).
 * `counts.ARCHIVED` llega solo cuando la API ya conoce ese estado (CLGDC-157).
 */
export interface IAdminPublicationPage<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  counts: Partial<Record<IAdminPublicationStatus, number>>;
}

/** Ciudad del filtro del listado. */
export interface IAdminCityOption {
  id: string;
  name: string;
  slug: string;
}
