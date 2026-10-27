import "server-only";
/**
 * Fachada del panel del rol Comercio. Misma firma que tendrá el servicio real: hoy devuelve
 * los datos simulados de `lib/mock/dashboard/comercio`; al integrar, llamará a la API y las
 * páginas no cambian.
 */
import type {
  IDashboardComercioStats,
  IDashboardCompletionItem,
  IDashboardContactSummary,
  IDashboardTask,
  IDashboardVisitPoint,
} from "@/interfaces/dashboard";
import type { IListingDetail } from "@/interfaces/listing";
import { getTodayInSantiago, lastDays } from "@/lib/dashboard/dates";
import {
  MOCK_COMERCIO_COMPLETION,
  MOCK_COMERCIO_LISTINGS,
  MOCK_COMERCIO_STATS,
  MOCK_COMERCIO_TASKS,
  MOCK_COMERCIO_VISITS_14D,
} from "@/lib/mock/dashboard/comercio";
import type { IMockOwned } from "@/lib/mock/dashboard/types";

export async function getMyListings(): Promise<IMockOwned<IListingDetail>[]> {
  return MOCK_COMERCIO_LISTINGS;
}

export async function getMyStats(): Promise<IDashboardComercioStats> {
  return MOCK_COMERCIO_STATS;
}

/** Visitas por día de los últimos 14 días, terminando hoy. */
export async function getMyVisitsSeries(): Promise<IDashboardVisitPoint[]> {
  const dates = lastDays(MOCK_COMERCIO_VISITS_14D.length);
  return MOCK_COMERCIO_VISITS_14D.map((value, i) => ({ date: dates[i], value }));
}

export async function getMyProfileCompletion(): Promise<{
  pct: number;
  items: IDashboardCompletionItem[];
}> {
  return MOCK_COMERCIO_COMPLETION;
}

export async function getMyTasks(): Promise<IDashboardTask[]> {
  return MOCK_COMERCIO_TASKS;
}

/** Horario de hoy y contactos de la ficha principal. */
export async function getMyContactSummary(): Promise<IDashboardContactSummary> {
  const main = MOCK_COMERCIO_LISTINGS[0].item;
  const today = getTodayInSantiago();
  return {
    todayLabel: `Hoy, ${today.name}`,
    todayHours: main.schedule?.[today.key] ?? "Sin horario",
    phone: main.contact.phone,
    whatsapp: main.contact.whatsapp,
    website: main.contact.website,
    address: [main.address, main.commune].filter(Boolean).join(", "),
  };
}

/** Publicaciones en revisión: contador del menú «Mis publicaciones». */
export async function getMyInReviewCount(): Promise<number> {
  return MOCK_COMERCIO_LISTINGS.filter((l) => l.ownership.status === "review").length;
}
