import "server-only";
import { redirect } from "next/navigation";
import type {
  IAdminCityOption,
  IAdminClassifiedRow,
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

export interface IAdminClassifiedsQuery {
  status?: IAdminPublicationStatus;
  q?: string;
  cityId?: string;
  page?: number;
}

/** Avisos del panel admin (`GET /admin/classifieds`, CLGDC-120) con la sesión del request. */
export const adminClassifiedsService = {
  list: (query: IAdminClassifiedsQuery) => {
    const qs = new URLSearchParams({ limit: String(ADMIN_PAGE_SIZE) });
    if (query.status) qs.set("status", query.status);
    if (query.q) qs.set("q", query.q);
    if (query.cityId) qs.set("cityId", query.cityId);
    if (query.page && query.page > 1) qs.set("page", String(query.page));
    return apiFetchServer<IAdminPublicationPage<IAdminClassifiedRow>>(`/admin/classifieds?${qs}`);
  },
  /** `PATCH /admin/classifieds/:id/status`; `rejectionReason` solo con `REJECTED` (ahí es obligatorio). */
  setStatus: (id: string, status: IAdminPublicationStatus, rejectionReason?: string) =>
    apiFetchServer<unknown>(`/admin/classifieds/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify(status === "REJECTED" ? { status, rejectionReason } : { status }),
    }),
};

/**
 * Datos de «Avisos» del admin (CLGDC-127): filtros de la URL (`?q=`, `?ciudad=` por slug,
 * `?estado=`, `?page=`), ciudades del filtro y la página de la API, como `loadAdminListingsPage`.
 * Una página fuera de rango vuelve a la última que existe.
 */
export async function loadAdminClassifiedsPage(searchParams: IAdminListSearchParams, basePath: string) {
  const filters = parseAdminListParams(searchParams);
  const cities: IAdminCityOption[] = (await getCities())
    .map(({ id, name, slug }) => ({ id, name, slug }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  const cityId = cities.find((c) => c.slug === filters.city)?.id;
  const city = cityId ? filters.city : "";

  const data = await adminClassifiedsService.list({
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
