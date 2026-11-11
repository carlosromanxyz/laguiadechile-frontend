/**
 * Resúmenes del inicio del panel (CLGDC-192): `GET /admin/stats` del admin y `GET /me/summary` de
 * cada cuenta.
 */
import type { IAdminPublicationStatus } from "@/interfaces/admin-publication";
import type { PersonName } from "@/lib/people";

/** Publicaciones por estado efectivo (un aviso o evento publicado que ya pasó cuenta como `EXPIRED`). */
export type IStatusCounts = Record<IAdminPublicationStatus, number>;

/** Grupos de publicaciones del panel: fichas por tipo, avisos, eventos, propiedades y lugares (CLGDC-209). */
export type IPublicationGroup = "comercios" | "servicios" | "classifieds" | "events" | "properties" | "places";

export type IPublicationCounts = Record<IPublicationGroup, IStatusCounts>;

/** Tipo de publicación de la API (`ModerationKind`). */
export type IPublicationKind = "LISTING" | "CLASSIFIED" | "EVENT" | "PROPERTY" | "PLACE";

/** Una fila de «Actividad reciente» del admin. */
export interface IAdminRecentItem {
  kind: IPublicationKind;
  /** Solo en `LISTING`. */
  type?: "COMERCIO" | "SERVICIO";
  id: string;
  title: string;
  slug: string;
  status: IAdminPublicationStatus;
  /** ISO */
  updatedAt: string;
  /** `null` si el dueño se borró. El nombre visible se arma con `formatPersonName`. */
  owner: PersonName | null;
}

/** `GET /admin/stats`. */
export interface IAdminStats {
  publications: IPublicationCounts;
  news: { total: number };
  users: { total: number; last7Days: number };
  contact: { unread: number };
  recent: IAdminRecentItem[];
}

/** Visitas y clics (WhatsApp, llamadas y web) de 7 días. */
export interface IMetrics7d {
  views: number;
  clicks: number;
}

/** Una publicación rechazada de la cuenta, con el motivo. */
export interface IMySummaryRejection {
  kind: IPublicationKind;
  type?: "COMERCIO" | "SERVICIO";
  id: string;
  title: string;
  reason: string | null;
  updatedAt: string;
}

/** `GET /me/summary`. */
export interface IMySummary {
  publications: IPublicationCounts;
  metrics7d: { comercio: IMetrics7d; servicio: IMetrics7d };
  rejections: IMySummaryRejection[];
}
