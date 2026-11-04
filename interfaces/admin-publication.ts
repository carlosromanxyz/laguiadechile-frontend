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

/**
 * Lo común de una fila de los listados admin de publicaciones (fichas y avisos): lo que pinta
 * `LDCAdminPublicationList`. Un aviso puede no tener categoría (CLGDC-127).
 */
export interface IAdminPublicationRow {
  id: string;
  title: string;
  slug: string;
  image: string;
  featured: boolean;
  status: IAdminPublicationStatus;
  /** Texto plano que escribió el equipo; solo con `REJECTED`. */
  rejectionReason: string | null;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  city: { id: string; name: string; slug: string };
  owner: { id: string; name: string } | null;
}

/** Fila de `GET /admin/listings`: sin descripción, con dueño y motivo del rechazo. */
export interface IAdminListingRow extends IAdminPublicationRow {
  type: IAdminListingType;
  category: { id: string; name: string; slug: string };
}

/** Tipo de aviso (`ClassifiedType` de la API). */
export type IAdminClassifiedType = "VENDO" | "COMPRO" | "ARRIENDO" | "BUSCO" | "OFREZCO";

/**
 * Fila de `GET /admin/classifieds` (CLGDC-120): como la de fichas, con el tipo de aviso y su
 * vencimiento. `status` llega **efectivo**: un aviso publicado con `expiresAt` pasado es `EXPIRED`.
 */
export interface IAdminClassifiedRow extends IAdminPublicationRow {
  type: IAdminClassifiedType;
  expiresAt: string | null;
}

/**
 * Fila de `GET /admin/properties` (CLGDC-164): como las demás, sin categoría (las propiedades no
 * tienen), con tipo, operación y precio. Las propiedades no vencen: nunca llega `EXPIRED`.
 */
export interface IAdminPropertyRow extends IAdminPublicationRow {
  type: "CASA" | "DEPARTAMENTO" | "TERRENO" | "OFICINA" | "LOCAL" | "BODEGA";
  operation: "VENTA" | "ARRIENDO" | "ARRIENDO_TEMPORAL";
  priceAmount: number;
  priceCurrency: "UF" | "CLP";
  pricePeriod: string | null;
  category: null;
}

/**
 * Fila de `GET /admin/events` (CLGDC-138, CLGDC-140): como la de avisos, con las fechas y el lugar.
 * `status` llega **efectivo**: un evento publicado que ya terminó es `EXPIRED`. La categoría es
 * opcional.
 */
export interface IAdminEventRow extends IAdminPublicationRow {
  startsAt: string;
  endsAt: string | null;
  venueName: string;
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
