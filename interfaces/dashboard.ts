import type { LDCRole } from "@/lib/auth/roles";

/** Usuario que se muestra en el panel (sidebar, menú de usuario y saludo). */
export interface IDashboardUser {
  name: string;
  email: string;
  /** Nombre corto para el saludo («Hola, María»). */
  greetingName: string;
}

/** Sesión del panel: el admin real o el usuario simulado por la cookie `ldc-mock-role`. */
export interface IDashboardSession {
  user: IDashboardUser;
  role: LDCRole;
  /** `true` si viene de la simulación de roles (sin backend). */
  simulated: boolean;
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

/** Elemento de la cola de moderación del administrador. */
export interface IDashboardModerationItem {
  id: string;
  kind: "new-listing" | "renewal" | "report";
  title: string;
  /** Quién lo envió o el motivo del reporte. */
  by: string;
  city: string;
  /** Tiempo relativo ya redactado («hace 2 h», «ayer»). */
  when: string;
  image: string;
  /** Página pública del elemento. */
  href: string;
}

/** Punto de la serie de visitas por día. */
export interface IDashboardVisitPoint {
  /** Fecha ISO (medianoche del día en America/Santiago). */
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

/** Favorito guardado por el usuario. */
export interface IDashboardFavorite {
  id: string;
  /** Tipo visible: «Comercio», «Servicio», «Propiedad», «Noticia». */
  kind: string;
  title: string;
  /** Ciudad o categoría bajo el título. */
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

/** Métricas simuladas del comercio (30 días). */
export interface IDashboardComercioStats {
  visits: number;
  /** Variación en % contra los 30 días previos. */
  visitsDelta: number;
  whatsapp: number;
  calls: number;
  web: number;
}
