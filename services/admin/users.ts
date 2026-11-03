import "server-only";
import { redirect } from "next/navigation";
import type { IAdminUserPage, IAdminUserRow } from "@/interfaces/admin-user";
import { apiFetchServer } from "@/lib/api-client";
import { toBackendRoles, toLDCRoles } from "@/lib/auth/backend-role";
import type { LDCRole } from "@/lib/auth/roles";
import { ADMIN_PAGE_SIZE } from "./listings";

/** Fila tal como llega de la API (roles en mayúscula: `ADMIN`, `COMERCIO`…). */
type RawAdminUserRow = Omit<IAdminUserRow, "roles"> & { roles: string[] };

const toRow = (raw: RawAdminUserRow): IAdminUserRow => ({ ...raw, roles: toLDCRoles(raw.roles) });

/** Usuarios del panel admin (`GET /admin/users`, CLGDC-120) con la sesión del request. */
export const adminUsersService = {
  list: async (query: { q?: string; page?: number }): Promise<IAdminUserPage> => {
    const qs = new URLSearchParams({ limit: String(ADMIN_PAGE_SIZE) });
    if (query.q) qs.set("q", query.q);
    if (query.page && query.page > 1) qs.set("page", String(query.page));
    const page = await apiFetchServer<Omit<IAdminUserPage, "items"> & { items: RawAdminUserRow[] }>(
      `/admin/users?${qs}`,
    );
    return { ...page, items: page.items.map(toRow) };
  },
  /**
   * `PATCH /admin/users/:id/roles` con la lista completa (la API suma USUARIO siempre). Responde 400
   * si un admin intenta quitarse ADMIN a sí mismo o si dejaría el sistema sin ningún ADMIN.
   */
  setRoles: async (id: string, roles: readonly LDCRole[]) =>
    toRow(
      await apiFetchServer<RawAdminUserRow>(`/admin/users/${encodeURIComponent(id)}/roles`, {
        method: "PATCH",
        body: JSON.stringify({ roles: toBackendRoles(roles) }),
      }),
    ),
};

export interface IAdminUsersSearchParams {
  q?: string | string[];
  page?: string | string[];
}

/**
 * Datos de «Usuarios» del admin (CLGDC-127): búsqueda (`?q=`, nombre o correo, ≤ 200) y página
 * (`?page=`, 1..10000) de la URL. Una página fuera de rango vuelve a la última que existe.
 */
export async function loadAdminUsersPage(searchParams: IAdminUsersSearchParams, basePath: string) {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = first(searchParams.q).trim().slice(0, 200);
  const rawPage = Number.parseInt(first(searchParams.page), 10);
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(rawPage, 1), 10000) : 1;

  const data = await adminUsersService.list({ q: q || undefined, page });

  const pageCount = Math.max(1, Math.ceil(data.total / ADMIN_PAGE_SIZE));
  if (data.items.length === 0 && data.total > 0 && page > pageCount) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (pageCount > 1) params.set("page", String(pageCount));
    const qs = params.toString();
    redirect(qs ? `${basePath}?${qs}` : basePath);
  }

  return { data, q, page: data.page };
}
