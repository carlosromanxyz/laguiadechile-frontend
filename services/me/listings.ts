import "server-only";
import type { IMyListing, IMyListingUpdate } from "@/interfaces/my-listing";
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
