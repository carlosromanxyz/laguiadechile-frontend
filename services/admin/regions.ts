import "server-only";
import { apiFetchServer } from "@/lib/api-client";
import type { IAdminRegion, IAdminRegionUpsert } from "@/interfaces/admin-catalog";

const BASE = "/regions";

/** Regiones del panel admin (`/regions`: todas, con sus ciudades) con la sesión del request. */
export const adminRegionsService = {
  list: () => apiFetchServer<IAdminRegion[]>(BASE),
  create: (data: IAdminRegionUpsert) =>
    apiFetchServer<IAdminRegion>(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<IAdminRegionUpsert>) =>
    apiFetchServer<IAdminRegion>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    apiFetchServer<{ status: string }>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
