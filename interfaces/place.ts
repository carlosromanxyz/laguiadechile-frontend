import type { IListingSchedule } from "./listing";

/** Tipo de lugar (`PlaceType` de la API, CLGDC-207). */
export type IPlaceType = "ATTRACTION" | "PUBLIC_SERVICE" | "MARKET";

/**
 * Lugar público sin dueño (`GET /places`, `GET /places/:slug`, CLGDC-207): un atractivo, un servicio
 * público o una feria. Lo carga el admin; todo lo que existe está publicado. `description` es HTML
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

/** Lugar en el panel admin: lo que devuelve la API, con `cityId` y los `null` tal cual. */
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
  city: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

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
