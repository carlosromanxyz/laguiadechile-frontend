import type { LDCRole } from "@/lib/auth/roles";

/** Usuario que se muestra en el panel (sidebar, menú de usuario y saludo). */
export interface IDashboardUser {
  name: string;
  email: string;
  /** Nombre corto para el saludo («Hola, María»). */
  greetingName: string;
}

/** Sesión del panel: la cuenta de `/auth/me` y sus roles (al menos uno, en el orden de `LDC_ROLE_KEYS`). */
export interface IDashboardSession {
  user: IDashboardUser;
  roles: LDCRole[];
}

/** Estado de una publicación propia (comercio o usuario). */
export type IDashboardPublicationStatus = "published" | "review" | "expired" | "rejected";

/** Tarea o aviso destacado del inicio («Para hoy», avisos vencidos). */
export interface IDashboardTask {
  id: string;
  /** `warning`: triángulo naranjo-rojo; `info`: reloj en el color de acento. */
  tone: "warning" | "info";
  title: string;
  description: string;
  action?: { label: string; href: string };
}

/** Tipo de publicación que se modera (ruta `/admin/moderation/:kind/:id`). */
export type IDashboardModerationKind = "listing" | "classified";

/** Elemento de la cola de moderación del administrador (`GET /admin/moderation`). */
export interface IDashboardModerationItem {
  id: string;
  kind: IDashboardModerationKind;
  title: string;
  slug: string;
  image: string;
  /** Quién lo envió («Mascotas Felices SpA · comercio»). */
  by: string;
  /** Tiempo relativo ya redactado («hace 2 h», «ayer»). */
  when: string;
  /** Descripción en texto plano: se muestra como texto, nunca como HTML. */
  description: string;
}

/** Resultado de una server action del panel (aprobar, rechazar, quitar un favorito). */
export type IDashboardActionResult = { ok: true } | { ok: false; message: string };

/** Estado y métricas de una publicación propia (comercio o usuario). */
export interface IDashboardOwnership {
  status: IDashboardPublicationStatus;
  /** Visitas de los últimos 30 días; `null` si no se miden (avisos) o no se pudieron leer. */
  visits30d: number | null;
  /** Motivo del rechazo que escribió el equipo (texto plano; solo con `rejected`). */
  rejectionReason?: string;
}

/** Publicación propia (`T`) con su estado y métricas. */
export interface IDashboardOwned<T> {
  item: T;
  ownership: IDashboardOwnership;
}

/** Punto de la serie de visitas por día. */
export interface IDashboardVisitPoint {
  /** Fecha ISO (mediodía UTC del día de America/Santiago, para que no cambie de día al formatear). */
  date: string;
  value: number;
}

/** Ítem de la lista de completitud de la ficha. */
export interface IDashboardCompletionItem {
  label: string;
  done: boolean;
}

/** Resumen de horario y contacto de la ficha del comercio. */
export interface IDashboardContactSummary {
  /** «Hoy, martes» */
  todayLabel: string;
  /** Horario de hoy («09:00 - 20:00» o «Cerrado»). */
  todayHours: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
}

/** Tipo de favorito del backend (`DELETE /me/favorites/:kind/:targetId`). */
export type IDashboardFavoriteKind = "LISTING" | "CLASSIFIED" | "PROPERTY" | "NEWS";

/** Favorito guardado por el usuario. */
export interface IDashboardFavorite {
  /** `${kindKey}:${targetId}` */
  id: string;
  kindKey: IDashboardFavoriteKind;
  targetId: string;
  /** Tipo visible: «Comercio», «Servicio», «Propiedad», «Noticia». */
  kind: string;
  title: string;
  /** Ciudad bajo el título (vacío si no tiene, p. ej. una noticia). */
  place: string;
  image: string;
  href: string;
}

/** Noticia reciente del inicio del administrador. */
export interface IDashboardNewsItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  publishedAt: string;
  authorName: string;
}

/** Conteos del inicio del administrador (datos reales de la API). */
export interface IDashboardAdminCounts {
  listings: number;
  listingsFeatured: number;
  classifieds: number;
  classifiedsExpired: number;
  properties: number;
  news: number;
  categories: number;
  cities: number;
  regions: number;
}

/** Métricas del comercio en los últimos 30 días (`GET /me/metrics?days=30`). */
export interface IDashboardComercioStats {
  visits: number;
  /** Variación en % contra los 30 días previos; `null` si antes hubo 0 visitas y ahora no. */
  visitsDelta: number | null;
  whatsapp: number;
  calls: number;
  web: number;
}
