import "server-only";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { ApiError } from "@/lib/api-client";

/**
 * Texto fijo para el admin según el status de la API al guardar o eliminar un registro del
 * catálogo (nunca el mensaje crudo del backend).
 *
 * Hoy la API responde 500 cuando el slug ya existe (la unique de Prisma no se traduce) y 404 cuando
 * no puede borrar por registros asociados (el `catch` del servicio lo informa como «no existe»):
 * los textos cubren esos dos casos.
 */
export function catalogSaveError(e: unknown): IDashboardActionResult {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return { ok: false, message: "Revisa los datos marcados e inténtalo de nuevo." };
  if (status === 401 || status === 403) return { ok: false, message: "Tu sesión expiró o no tienes permiso." };
  if (status === 404) return { ok: false, message: "Este registro ya no existe." };
  if (status === 409 || status >= 500) {
    return { ok: false, message: "No pudimos guardar. Revisa que el slug no lo use otro registro." };
  }
  return { ok: false, message: "No pudimos guardar. Inténtalo de nuevo en unos minutos." };
}

export function catalogDeleteError(e: unknown): IDashboardActionResult {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 401 || status === 403) return { ok: false, message: "Tu sesión expiró o no tienes permiso." };
  if (status === 404 || status === 409) {
    return {
      ok: false,
      message: "No se pudo eliminar: tiene registros asociados o ya no existe.",
    };
  }
  return { ok: false, message: "No se pudo eliminar. Inténtalo de nuevo en unos minutos." };
}

export const INVALID_ID: IDashboardActionResult = { ok: false, message: "Registro inválido." };
export const INVALID_FORM: IDashboardActionResult = {
  ok: false,
  message: "Revisa los datos marcados e inténtalo de nuevo.",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (id: unknown): id is string => typeof id === "string" && UUID.test(id);
