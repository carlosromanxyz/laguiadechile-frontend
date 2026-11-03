import "server-only";
import { apiFetchServer } from "@/lib/api-client";
import type { IAdminNews, IAdminNewsUpsert } from "@/interfaces/admin-catalog";

const BASE = "/news";

/** Noticias del panel admin (`/news`, máx. 200 por pedido) con la sesión del request. */
export const adminNewsService = {
  list: (params?: { search?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.limit) qs.set("limit", String(params.limit));
    const tail = qs.toString();
    return apiFetchServer<IAdminNews[]>(tail ? `${BASE}?${tail}` : BASE);
  },
  create: (data: IAdminNewsUpsert) =>
    apiFetchServer<IAdminNews>(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<IAdminNewsUpsert>) =>
    apiFetchServer<IAdminNews>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    apiFetchServer<{ status: string }>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
