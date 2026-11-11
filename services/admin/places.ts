import "server-only";
import { redirect } from "next/navigation";
import type { IAdminCityOption, IAdminPublicationPage, IAdminPublicationStatus } from "@/interfaces/admin-publication";
import type { IAdminPlace, IAdminPlaceRow, IAdminPlaceUpsert } from "@/interfaces/place";
import { getCities } from "@/lib/api/catalog";
import { apiFetchServer } from "@/lib/api-client";
import { parseAdminListParams, type IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";
import { ADMIN_PAGE_SIZE } from "./listings";

const BASE = "/places";

export interface IAdminPlacesQuery {
  status?: IAdminPublicationStatus;
  q?: string;
  cityId?: string;
  page?: number;
}

/**
 * Lugares del panel admin con la sesión del request. El listado y el detalle van por
 * `/admin/places` (todos los estados, CLGDC-209: `/places` público ya solo trae los publicados);
 * crear, editar y borrar, por `/places` (CLGDC-207).
 */
export const adminPlacesService = {
  list: async (query: IAdminPlacesQuery) => {
    const qs = new URLSearchParams({ limit: String(ADMIN_PAGE_SIZE) });
    if (query.status) qs.set("status", query.status);
    if (query.q) qs.set("q", query.q);
    if (query.cityId) qs.set("cityId", query.cityId);
    if (query.page && query.page > 1) qs.set("page", String(query.page));
    const page = await apiFetchServer<IAdminPublicationPage<Omit<IAdminPlaceRow, "category">>>(
      `/admin/places?${qs}`,
    );
    // Sin categoría: el listado admin la omite en la línea de lugar.
    return { ...page, items: page.items.map((p): IAdminPlaceRow => ({ ...p, category: null })) };
  },
  /** `GET /admin/places/:id`: el lugar completo en cualquier estado (404 si no existe). */
  get: (id: string) => apiFetchServer<IAdminPlace>(`/admin/places/${encodeURIComponent(id)}`),
  /** `PATCH /admin/places/:id/status`; `rejectionReason` solo con `REJECTED` (ahí es obligatorio). */
  setStatus: (id: string, status: IAdminPublicationStatus, rejectionReason?: string) =>
    apiFetchServer<unknown>(`/admin/places/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify(status === "REJECTED" ? { status, rejectionReason } : { status }),
    }),
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

/**
 * Datos de «Lugares» del admin (CLGDC-209): filtros de la URL (`?q=`, `?ciudad=` por slug,
 * `?estado=`, `?page=`), ciudades del filtro y la página de la API, como
 * `loadAdminPropertiesPage`. Una página fuera de rango vuelve a la última que existe.
 */
export async function loadAdminPlacesPage(searchParams: IAdminListSearchParams, basePath: string) {
  const parsed = parseAdminListParams(searchParams);
  // Los lugares no vencen: `?estado=vencidas` se trata como sin filtro.
  const filters = { ...parsed, status: parsed.status === "EXPIRED" ? null : parsed.status };
  const cities: IAdminCityOption[] = (await getCities())
    .map(({ id, name, slug }) => ({ id, name, slug }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  const cityId = cities.find((c) => c.slug === filters.city)?.id;
  const city = cityId ? filters.city : "";

  const data = await adminPlacesService.list({
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
