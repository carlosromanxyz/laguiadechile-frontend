"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { IFavoriteKind, IFavoriteToggleResult } from "@/interfaces/favorite";
import { ApiError, AUTH_COOKIE, apiFetchServer } from "@/lib/api-client";
import { isValidFavoriteTarget } from "@/lib/favorites/target";

const AUTH_MESSAGE = "Inicia sesión para guardar tus favoritos.";

/**
 * Guarda (`nextSaved: true`) o quita un favorito del usuario de la sesión, desde el sitio
 * público (`LDCFavoriteButton`).
 *
 * Vale para cualquier rol: el backend no restringe `/me/favorites` por rol, así que no se usa
 * `requireDashboardRole` (que además redirige, y aquí el botón decide adónde ir). Sin cookie
 * de sesión, o si el backend responde 401, devuelve `reason: "auth"` sin lanzar.
 * Las dos operaciones son idempotentes en el backend.
 */
export async function toggleFavoriteAction(
  kind: IFavoriteKind,
  targetId: string,
  nextSaved: boolean,
): Promise<IFavoriteToggleResult> {
  if (!isValidFavoriteTarget(kind, targetId) || typeof nextSaved !== "boolean") {
    return { ok: false, reason: "invalid", message: "Favorito inválido." };
  }

  const jar = await cookies();
  if (!jar.has(AUTH_COOKIE)) return { ok: false, reason: "auth", message: AUTH_MESSAGE };

  try {
    if (nextSaved) {
      await apiFetchServer("/me/favorites", {
        method: "POST",
        body: JSON.stringify({ kind, targetId }),
      });
    } else {
      await apiFetchServer(`/me/favorites/${kind}/${targetId}`, { method: "DELETE" });
    }
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 0;
    if (status === 401) return { ok: false, reason: "auth", message: AUTH_MESSAGE };
    if (status === 404) return { ok: false, reason: "error", message: "Ya no existe." };
    if (status === 429) {
      return { ok: false, reason: "error", message: "Demasiados intentos, espera un momento." };
    }
    return { ok: false, reason: "error", message: "No pudimos completar la acción." };
  }

  // La lista y el inicio del panel del usuario leen los favoritos.
  revalidatePath("/dashboard/usuario", "layout");
  return { ok: true };
}
