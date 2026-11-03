"use server";

import { revalidatePath } from "next/cache";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { adminContactMessagesService } from "@/services/admin/contact-messages";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 401 || status === 403) return "No tienes permiso";
  if (status === 404) return "Este mensaje ya no existe";
  if (status === 429) return "Demasiados intentos, espera un momento";
  return "No pudimos completar la acción";
}

/**
 * Marca un mensaje de contacto como leído (`true`) o no leído (`false`) desde la bandeja admin
 * (`PATCH /admin/contact-messages/:id`, CLGDC-119). Revalida el panel (la bandeja y el badge
 * «Mensajes» del menú) salvo con `revalidate: false`: la lectura automática al abrir un mensaje,
 * que refresca al cerrar el diálogo para que la fila no desaparezca mientras se lee.
 */
export async function setContactMessageReadAction(
  id: string,
  read: boolean,
  revalidate: boolean = true,
): Promise<IDashboardActionResult> {
  // Cada acción revalida el rol: una server action se puede invocar sin pasar por el layout.
  await requireDashboardRole("admin");
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, message: "Mensaje inválido." };
  if (typeof read !== "boolean") return { ok: false, message: "Acción inválida." };

  try {
    await adminContactMessagesService.setRead(id, read);
  } catch (e) {
    return { ok: false, message: friendlyError(e) };
  }

  if (revalidate !== false) revalidatePath("/dashboard", "layout");
  return { ok: true };
}
