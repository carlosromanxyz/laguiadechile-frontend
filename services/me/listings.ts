import "server-only";
import type { IMyListing, IMyListingCreate, IMyListingUpdate } from "@/interfaces/my-listing";
import { apiFetchServer } from "@/lib/api-client";
import { mapListing } from "@/lib/api/mappers";
import { toPublicationStatus } from "@/lib/dashboard/status";

/** Lo que devuelven `GET /me/listings` y `PATCH /me/listings/:id`: el listing plano más `status`. */
type RawMyListing = Parameters<typeof mapListing>[0] & { status?: string | null };

const mapMyListing = (l: RawMyListing): IMyListing => ({
  ...mapListing(l),
  status: toPublicationStatus(l.status),
});

/**
 * Fichas del comercio con sesión (`@Roles('COMERCIO')`), la editada más recientemente primero.
 * A diferencia de `services/dashboard/comercio.ts`, un error del backend se propaga (la página de
 * edición no debe confundir una caída con «no tienes ficha»).
 */
export async function getMyListings(): Promise<IMyListing[]> {
  return (await apiFetchServer<RawMyListing[]>("/me/listings")).map(mapMyListing);
}

/** Edita una ficha propia; el backend la deja en `REVIEW`. */
export async function updateMyListing(id: string, data: IMyListingUpdate): Promise<IMyListing> {
  const raw = await apiFetchServer<RawMyListing>(`/me/listings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return mapMyListing(raw);
}

/**
 * Crea una ficha propia (`POST /me/listings`, USUARIO o COMERCIO). Nace en `REVIEW` y, si quien la
 * crea es USUARIO, el backend lo promueve a COMERCIO en la misma transacción. El JWT no cambia:
 * el rol nuevo se relee de `/auth/me` en el siguiente request.
 */
export async function createMyListing(data: IMyListingCreate): Promise<IMyListing> {
  const { type, ...rest } = data;
  const raw = await apiFetchServer<{ listing: RawMyListing; role: string }>("/me/listings", {
    method: "POST",
    body: JSON.stringify({ ...rest, type: type === "servicio" ? "SERVICIO" : "COMERCIO" }),
  });
  return mapMyListing(raw.listing);
}
