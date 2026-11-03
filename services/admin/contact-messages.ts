import "server-only";
import { redirect } from "next/navigation";
import type {
  IContactMessage,
  IContactMessagePage,
  IContactMessageReadFilter,
} from "@/interfaces/contact-message";
import { apiFetchServer } from "@/lib/api-client";
import {
  contactReadFilterFromKey,
  type IContactMessageSearchParams,
} from "@/lib/dashboard/contact-message-status";

/** Tamaño de página de la bandeja (el `DEFAULT_LIMIT` del backend). */
export const CONTACT_MESSAGES_PAGE_SIZE = 20;

export interface IContactMessagesQuery {
  q?: string;
  read?: IContactMessageReadFilter;
  page?: number;
  limit?: number;
}

/** Bandeja del formulario de contacto (`/admin/contact-messages`, CLGDC-119) con la sesión del request. */
export const adminContactMessagesService = {
  list: (query: IContactMessagesQuery = {}) => {
    const qs = new URLSearchParams({ limit: String(query.limit ?? CONTACT_MESSAGES_PAGE_SIZE) });
    if (query.q) qs.set("q", query.q);
    if (query.read) qs.set("unread", query.read === "unread" ? "true" : "false");
    if (query.page && query.page > 1) qs.set("page", String(query.page));
    return apiFetchServer<IContactMessagePage>(`/admin/contact-messages?${qs}`);
  },
  /** `PATCH /admin/contact-messages/:id`: `true` marca leído (conserva la primera lectura). */
  setRead: (id: string, read: boolean) =>
    apiFetchServer<IContactMessage>(`/admin/contact-messages/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ read }),
    }),
};

/** No leídos de toda la bandeja (badge «Mensajes» del menú); `0` si la API falla. */
export async function getUnreadContactMessagesCount(): Promise<number> {
  try {
    return (await adminContactMessagesService.list({ limit: 1 })).unreadCount;
  } catch {
    return 0;
  }
}

/** Filtros de la URL de la bandeja ya saneados (`q` ≤ 200, `page` entre 1 y 10000). */
function parseContactMessageParams(params: IContactMessageSearchParams) {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = first(params.q).trim().slice(0, 200);
  const read = contactReadFilterFromKey(first(params.estado));
  const rawPage = Number.parseInt(first(params.page), 10);
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(rawPage, 1), 10000) : 1;
  return { q, read, page };
}

/**
 * Datos de la página «Mensajes» del admin: filtros de la URL (`?q=`, `?estado=`, `?page=`) y la
 * página de la API, con los conteos de las pills. Una página fuera de rango vuelve a la última que
 * existe.
 */
export async function loadContactMessagesPage(searchParams: IContactMessageSearchParams, basePath: string) {
  const filters = parseContactMessageParams(searchParams);
  const data = await adminContactMessagesService.list({
    q: filters.q || undefined,
    read: filters.read,
    page: filters.page,
  });

  const pageCount = Math.max(1, Math.ceil(data.total / CONTACT_MESSAGES_PAGE_SIZE));
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

  // Sin `counts` (API anterior a CLGDC-124) y sin filtros, se deducen del total y `unreadCount`.
  const counts = data.counts ?? {
    unread: data.unreadCount,
    read: Math.max(0, data.total - data.unreadCount),
  };

  return { data, counts, filters: { q: filters.q, read: filters.read, page: data.page } };
}
