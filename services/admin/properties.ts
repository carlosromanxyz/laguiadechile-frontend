import "server-only";
import { apiFetchServer } from "@/lib/api-client";
import type { IAdminProperty, IAdminPropertyUpsert } from "@/interfaces/admin-catalog";

const BASE = "/properties";

/** Propiedades del panel admin (`/properties`, máx. 200 por pedido) con la sesión del request. */
export const adminPropertiesService = {
  list: (params?: { search?: string; limit?: number; cityId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.cityId) qs.set("cityId", params.cityId);
    const tail = qs.toString();
    return apiFetchServer<IAdminProperty[]>(tail ? `${BASE}?${tail}` : BASE);
  },
  create: (data: IAdminPropertyUpsert) =>
    apiFetchServer<IAdminProperty>(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<IAdminPropertyUpsert>) =>
    apiFetchServer<IAdminProperty>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    apiFetchServer<{ status: string }>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
