import type { IDashboardPublicationStatus } from "./dashboard";
import type { IListingDetail, IListingSchedule } from "./listing";

/** Ficha propia del comercio (`GET /me/listings`): el detalle de siempre más su estado de moderación. */
export interface IMyListing extends IListingDetail {
  status: IDashboardPublicationStatus;
}

/** Cuerpo de `PATCH /me/listings/:id` (la ficha vuelve a `REVIEW`). */
export interface IMyListingUpdate {
  title: string;
  description: string;
  image: string;
  gallery: string[];
  categoryId: string;
  cityId: string;
  address: string | null;
  commune: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  schedule: IListingSchedule | null;
}

/** Resultado de la server action que guarda la ficha (no lanza: el mensaje llega al formulario). */
export type IUpdateMyListingResult = { ok: true; listing: IMyListing } | { ok: false; message: string };

/** Cuerpo de `POST /me/listings`: lo mismo que al editar más el tipo (la ficha nace en `REVIEW`). */
export interface IMyListingCreate extends IMyListingUpdate {
  type: IListingDetail["type"];
}

/** Resultado de la server action que crea la ficha (no lanza: el mensaje llega al formulario). */
export type ICreateMyListingResult = { ok: true; listing: IMyListing } | { ok: false; message: string };
