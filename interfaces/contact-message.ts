/** Mensaje del formulario de contacto tal como lo entrega `GET /admin/contact-messages` (CLGDC-119). */
export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  /** Texto plano multilínea: se pinta solo como texto (nunca HTML) */
  message: string;
  /** Fecha de la primera lectura; `null` si no está leído */
  readAt: string | null;
  /** Error del reenvío por correo; el mensaje queda guardado igual */
  mailError: string | null;
  createdAt: string;
}

/** Página de la bandeja admin de mensajes. */
export interface IContactMessagePage {
  items: IContactMessage[];
  /** Total con los filtros actuales (incluido el de leído) */
  total: number;
  page: number;
  limit: number;
  /** No leídos de toda la bandeja, sin filtros (badge del menú) */
  unreadCount: number;
  /** Leídos y no leídos con la búsqueda, sin el filtro de leído (CLGDC-124) */
  counts?: { unread: number; read: number };
}

/** Filtro de leído de la bandeja (`?estado=`): `null` es «Todos». */
export type IContactMessageReadFilter = "unread" | "read" | null;

/** Campos del formulario público de contacto (`POST /contact`). */
export interface IContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot: oculto y vacío; si llega con valor, es un bot */
  website: string;
}

/** Resultado del envío del formulario de contacto. */
export type IContactFormResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "throttled" | "error"; message: string };
