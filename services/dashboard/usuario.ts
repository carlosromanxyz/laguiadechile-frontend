import "server-only";
/**
 * Fachada del panel del rol Usuario. Misma firma que tendrá el servicio real: hoy devuelve
 * los datos simulados de `lib/mock/dashboard/usuario`.
 */
import type { IClassified } from "@/interfaces/classified";
import type { IDashboardFavorite } from "@/interfaces/dashboard";
import { MOCK_USUARIO_CLASSIFIEDS, MOCK_USUARIO_FAVORITES } from "@/lib/mock/dashboard/usuario";
import type { IMockOwned } from "@/lib/mock/dashboard/types";

export async function getMyClassifieds(): Promise<IMockOwned<IClassified>[]> {
  return MOCK_USUARIO_CLASSIFIEDS;
}

export async function getMyFavorites(): Promise<IDashboardFavorite[]> {
  return MOCK_USUARIO_FAVORITES;
}

/** Avisos vencidos: contador del menú «Mis avisos». */
export async function getMyExpiredCount(): Promise<number> {
  return MOCK_USUARIO_CLASSIFIEDS.filter((c) => c.ownership.status === "expired").length;
}
