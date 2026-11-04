import "server-only";
import { redirect } from "next/navigation";
import type { IAdminProperty, IAdminPropertyUpsert } from "@/interfaces/admin-catalog";
import type {
  IAdminCityOption,
  IAdminPropertyRow,
  IAdminPublicationPage,
  IAdminPublicationStatus,
} from "@/interfaces/admin-publication";
import { getCities } from "@/lib/api/catalog";
import { apiFetchServer } from "@/lib/api-client";
import {
  parseAdminListParams,
  type IAdminListSearchParams,
} from "@/lib/dashboard/admin-publication-status";
import { ADMIN_PAGE_SIZE } from "./listings";

const BASE = "/properties";

export interface IAdminPropertiesQuery {
  status?: IAdminPublicationStatus;
  q?: string;
  cityId?: string;
  page?: number;
}

/**
 * Propiedades del panel admin con la sesión del request. El listado y el detalle van por
 * `/admin/properties` (todos los estados, CLGDC-164); crear, editar y borrar, por `/properties`.
 */
export const adminPropertiesService = {
  list: async (query: IAdminPropertiesQuery) => {
    const qs = new URLSearchParams({ limit: String(ADMIN_PAGE_SIZE) });
    if (query.status) qs.set("status", query.status);
    if (query.q) qs.set("q", query.q);
    if (query.cityId) qs.set("cityId", query.cityId);
    if (query.page && query.page > 1) qs.set("page", String(query.page));
    const page = await apiFetchServer<IAdminPublicationPage<Omit<IAdminPropertyRow, "category">>>(
      `/admin/properties?${qs}`,
    );
    // Sin categoría: el listado admin la omite en la línea de lugar.
    return { ...page, items: page.items.map((p): IAdminPropertyRow => ({ ...p, category: null })) };
  },
  /** `GET /admin/properties/:id`: la propiedad completa en cualquier estado (404 si no existe). */
  get: (id: string) => apiFetchServer<IAdminProperty>(`/admin/properties/${encodeURIComponent(id)}`),
  /** `PATCH /admin/properties/:id/status`; `rejectionReason` solo con `REJECTED` (ahí es obligatorio). */
  setStatus: (id: string, status: IAdminPublicationStatus, rejectionReason?: string) =>
    apiFetchServer<unknown>(`/admin/properties/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify(status === "REJECTED" ? { status, rejectionReason } : { status }),
    }),
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

/**
 * Datos de «Propiedades» del admin (CLGDC-164): filtros de la URL (`?q=`, `?ciudad=` por slug,
 * `?estado=`, `?page=`), ciudades del filtro y la página de la API, como `loadAdminClassifiedsPage`.
 * Una página fuera de rango vuelve a la última que existe.
 */
export async function loadAdminPropertiesPage(searchParams: IAdminListSearchParams, basePath: string) {
  const parsed = parseAdminListParams(searchParams);
  // Las propiedades no vencen: `?estado=vencidas` se trata como sin filtro.
  const filters = { ...parsed, status: parsed.status === "EXPIRED" ? null : parsed.status };
  const cities: IAdminCityOption[] = (await getCities())
    .map(({ id, name, slug }) => ({ id, name, slug }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  const cityId = cities.find((c) => c.slug === filters.city)?.id;
  const city = cityId ? filters.city : "";

  const data = await adminPropertiesService.list({
    q: filters.q || undefined,
    cityId,
    status: filters.status ?? undefined,
    page: filters.page,
  });

  const pageCount = Math.max(1, Math.ceil(data.total / ADMIN_PAGE_SIZE));
  if (data.items.length === 0 && data.total > 0 && filters.page > pageCount) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      const value = Array.isArray(v) ? v[0] : v;
      if (value && k !== "page") params.set(k, value);
    }
    if (pageCount > 1) params.set("page", String(pageCount));
    const qs = params.toString();
    redirect(qs ? `${basePath}?${qs}` : basePath);
  }

  return { data, cities, filters: { q: filters.q, city, status: filters.status, page: data.page } };
}
