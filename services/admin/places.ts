import "server-only";
import { apiFetchServer } from "@/lib/api-client";
import type { IAdminPlace, IAdminPlaceUpsert } from "@/interfaces/place";

const BASE = "/places";

/** Lugares del panel admin (`/places`, máx. 200 por pedido) con la sesión del request (CLGDC-207). */
export const adminPlacesService = {
  list: (params?: { search?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.limit) qs.set("limit", String(params.limit));
    const tail = qs.toString();
    return apiFetchServer<IAdminPlace[]>(tail ? `${BASE}?${tail}` : BASE);
  },
  create: (data: IAdminPlaceUpsert) =>
    apiFetchServer<IAdminPlace>(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: IAdminPlaceUpsert) =>
    apiFetchServer<IAdminPlace>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  /** 204 sin cuerpo. */
  remove: (id: string) => apiFetchServer<void>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
