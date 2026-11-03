/**
 * Leído / no leído de la bandeja «Mensajes» del admin (CLGDC-124): textos, badge y clave de
 * `?estado=`. Helpers puros: sin I/O ni React, seguros en server y client.
 */
import type { LDCBadgeVariant } from "@/components/atoms/ldc-badge";
import type { IContactMessageReadFilter } from "@/interfaces/contact-message";

export const CONTACT_READ_META = {
  unread: { key: "no-leidos", label: "No leído", pill: "No leídos", badge: "message-unread" },
  read: { key: "leidos", label: "Leído", pill: "Leídos", badge: "message-read" },
} as const satisfies Record<
  Exclude<IContactMessageReadFilter, null>,
  { key: string; label: string; pill: string; badge: LDCBadgeVariant }
>;

/** Clave de «Todos» en `?estado=` (no filtra; en la URL se omite). */
export const CONTACT_READ_ALL = "todos";

/** Filtro a partir de `?estado=`; `null` con «todos» o un valor desconocido. */
export function contactReadFilterFromKey(key: string | undefined): IContactMessageReadFilter {
  if (key === CONTACT_READ_META.unread.key) return "unread";
  if (key === CONTACT_READ_META.read.key) return "read";
  return null;
}

export interface IContactMessageSearchParams {
  q?: string | string[];
  estado?: string | string[];
  page?: string | string[];
}
