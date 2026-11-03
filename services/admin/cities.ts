import "server-only";
import { apiFetchServer } from "@/lib/api-client";
import type { IAdminCity, IAdminCityUpsert } from "@/interfaces/admin-catalog";

const BASE = "/cities";

/** Ciudades del panel admin (`/cities`, máx. 500 por pedido) con la sesión del request. */
export const adminCitiesService = {
  list: (params?: { search?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.limit) qs.set("limit", String(params.limit));
    const tail = qs.toString();
    return apiFetchServer<IAdminCity[]>(tail ? `${BASE}?${tail}` : BASE);
  },
  create: (data: IAdminCityUpsert) =>
    apiFetchServer<IAdminCity>(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<IAdminCityUpsert>) =>
    apiFetchServer<IAdminCity>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    apiFetchServer<{ status: string }>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
