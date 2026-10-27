import "server-only";
import { apiFetchServer } from "@/lib/api-client";
import type { IAdminCategory, IAdminCategoryUpsert } from "@/interfaces/admin-category";

const BASE = "/categories";

export const adminCategoriesService = {
  list: (params?: { search?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.limit) qs.set("limit", String(params.limit));
    const tail = qs.toString();
    return apiFetchServer<IAdminCategory[]>(tail ? `${BASE}?${tail}` : BASE);
  },
  getBySlug: (slug: string) => apiFetchServer<IAdminCategory>(`${BASE}/${slug}`),
  create: (data: IAdminCategoryUpsert) =>
    apiFetchServer<IAdminCategory>(BASE, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<IAdminCategoryUpsert>) =>
    apiFetchServer<IAdminCategory>(`${BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    apiFetchServer<{ status: string }>(`${BASE}/${id}`, { method: "DELETE" }),
};
