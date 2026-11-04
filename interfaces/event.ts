import type { IDashboardPublicationStatus } from "./dashboard";

/** Precio de un evento (`EventPriceType` de la API): gratis o con costo. */
export type IEventPriceType = "FREE" | "PAID";

/** Contactos del organizador; cada uno es opcional. */
export interface IEventOrganizer {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
}

/**
 * Evento público (`GET /events`, `GET /events/:slug`, CLGDC-138). Las fechas van en ISO (UTC) y se
 * muestran en hora de Chile. `description` es HTML mínimo (`<p>` y `<br>`, validado en el backend).
 */
export interface IEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  startsAt: string;
  /** Sin término, el evento deja de mostrarse a la hora de inicio */
  endsAt?: string;
  venueName: string;
  address?: string;
  commune?: string;
  image: string;
  gallery: string[];
  priceType: IEventPriceType;
  /** Pesos chilenos enteros; solo con `PAID` (puede faltar: «Con costo») */
  priceAmount?: number;
  ticketUrl?: string;
  organizer: IEventOrganizer;
  featured: boolean;
  /** Opcional: un evento puede no tener categoría */
  category?: { id: string; name: string; slug: string; icon?: string };
  city: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

export type IEvents = IEvent[];

/** Filtro «Cuándo» del listado público (`?cuando=`). */
export type IEventWhen = "proximos" | "semana" | "mes" | "pasados";

/** Evento propio (`/me/events`): el evento más su estado efectivo (uno terminado llega `expired`). */
export interface IMyEvent extends IEvent {
  status: IDashboardPublicationStatus;
  /** Motivo del rechazo que escribió el equipo (texto plano; solo con `rejected`). */
  rejectionReason?: string;
}

/**
 * Cuerpo de `POST /me/events` y `PATCH /me/events/:id` (el evento queda en `REVIEW`). `description`
 * ya va en HTML mínimo (`descriptionTextToHtml`); las fechas, en ISO.
 */
export interface IMyEventInput {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  venueName: string;
  address: string | null;
  commune: string | null;
  categoryId: string | null;
  cityId: string;
  image: string;
  gallery: string[];
  priceType: IEventPriceType;
  priceAmount: number | null;
  ticketUrl: string | null;
  organizerName: string;
  organizerPhone: string | null;
  organizerWhatsapp: string | null;
  organizerEmail: string | null;
  organizerWebsite: string | null;
}

/** Resultado de las server actions del evento (no lanzan: el mensaje llega al formulario). */
export type IMyEventResult = { ok: true; event: IMyEvent } | { ok: false; message: string };
