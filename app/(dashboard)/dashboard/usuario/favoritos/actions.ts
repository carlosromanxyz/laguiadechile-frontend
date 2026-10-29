"use server";

import { revalidatePath } from "next/cache";
import type { IDashboardActionResult, IDashboardFavoriteKind } from "@/interfaces/dashboard";
import { ApiError, apiFetchServer } from "@/lib/api-client";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { isValidFavoriteTarget } from "@/lib/favorites/target";

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 401 || status === 403) return "No tienes permiso";
  if (status === 404) return "Ya no existe";
  if (status === 429) return "Demasiados intentos, espera un momento";
  return "No pudimos completar la acción";
}

/** Quita un favorito del usuario de la sesión. */
export async function removeFavoriteAction(
  kind: IDashboardFavoriteKind,
  targetId: string,
): Promise<IDashboardActionResult> {
  await requireDashboardSession();
  if (!isValidFavoriteTarget(kind, targetId)) {
    return { ok: false, message: "Favorito inválido." };
  }
  try {
    await apiFetchServer(`/me/favorites/${kind}/${targetId}`, { method: "DELETE" });
  } catch (e) {
    return { ok: false, message: friendlyError(e) };
  }
  revalidatePath("/dashboard/usuario", "layout");
  return { ok: true };
}
