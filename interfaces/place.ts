import type { IAdminPublicationRow, IAdminPublicationStatus } from "./admin-publication";
import type { IDashboardPublicationStatus } from "./dashboard";
import type { IListingSchedule } from "./listing";

/** Tipo de lugar (`PlaceType` de la API, CLGDC-207). */
export type IPlaceType = "ATTRACTION" | "PUBLIC_SERVICE" | "MARKET";

/**
 * Lugar público sin dueño (`GET /places`, `GET /places/:slug`, CLGDC-207): un atractivo, un servicio
 * público o una feria. Lo carga el admin o lo publica una cuenta (CLGDC-209); la API pública solo
 * trae los publicados. `description` es HTML
 * mínimo (`<p>` y `<br>`, validado en el backend). Los `null` de la API quedan como `undefined`.
 */
export interface IPlace {
  id: string;
  slug: string;
  title: string;
  type: IPlaceType;
  description: string;
  image: string;
  gallery: string[];
  address: string;
  commune?: string;
  schedule?: IListingSchedule;
  /** Teléfono de la oficina */
  phone?: string;
  /** Número corto de emergencia (131, 132, 133…), aparte del teléfono de la oficina */
  emergencyNumber?: string;
  website?: string;
  email?: string;
  featured: boolean;
  city: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

export type IPlaces = IPlace[];

/**
 * Lugar completo como lo guarda la API (`GET /admin/places/:id`, `GET /me/places/:id`), con
 * `cityId` y los `null` tal cual: lo que lee el formulario. `status` y `rejectionReason` llegan
 * desde CLGDC-209 (lo del admin y el seed queda PUBLISHED y sin dueño).
 */
export interface IAdminPlace {
  id: string;
  slug: string;
  title: string;
  type: IPlaceType;
  description: string;
  image: string;
  gallery: string[];
  address: string;
  commune: string | null;
  cityId: string;
  schedule: IListingSchedule | null;
  phone: string | null;
  emergencyNumber: string | null;
  website: string | null;
  email: string | null;
  featured: boolean;
  status?: IAdminPublicationStatus;
  rejectionReason?: string | null;
  city: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

/**
 * Fila de `GET /admin/places` (CLGDC-209): como las demás publicaciones, sin categoría (los lugares
 * no tienen), con el tipo y la dirección. Los lugares no vencen: nunca llega `EXPIRED`.
 */
export interface IAdminPlaceRow extends IAdminPublicationRow {
  type: IPlaceType;
  address: string;
  category: null;
}

/**
 * Lugar propio en «Mis lugares» (`GET /me/places`, CLGDC-209): el lugar completo con su estado en el
 * panel y, si fue rechazado, el motivo.
 */
export interface IMyPlace extends Omit<IAdminPlace, "status" | "rejectionReason"> {
  status: IDashboardPublicationStatus;
  rejectionReason?: string;
}

/**
 * Cuerpo de `POST /me/places` y `PATCH /me/places/:id` (CLGDC-209): el del admin sin `slug`,
 * `featured` ni `emergencyNumber`. El backend los rechaza (400) si llegan: el slug lo pone él, y un
 * usuario no publica números de emergencia ni se destaca.
 */
export type IMyPlaceUpsert = Omit<IAdminPlaceUpsert, "slug" | "featured" | "emergencyNumber">;

/** Cuerpo de `POST /places` y `PATCH /places/:id`. Sin `slug`, el backend lo genera del título. */
export interface IAdminPlaceUpsert {
  title: string;
  slug?: string;
  type: IPlaceType;
  description: string;
  image: string;
  gallery: string[];
  address: string;
  commune: string | null;
  cityId: string;
  schedule: IListingSchedule | null;
  phone: string | null;
  emergencyNumber: string | null;
  website: string | null;
  email: string | null;
  featured: boolean;
}
