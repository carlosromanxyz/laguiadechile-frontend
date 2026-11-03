"use server";

import { revalidatePath } from "next/cache";
import {
  ADMIN_SETTABLE_STATUSES,
  type IAdminPublicationStatus,
} from "@/interfaces/admin-publication";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { ApiError } from "@/lib/api-client";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { adminListingsService } from "@/services/admin/listings";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9-]{1,200}$/;

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function friendlyError(e: unknown): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return "Revisa el motivo e inténtalo de nuevo";
  if (status === 409) return "Esta ficha está archivada y no cambia de estado";
  if (status === 401 || status === 403) return "No tienes permiso";
  if (status === 404) return "Ya no existe";
  if (status === 429) return "Demasiados intentos, espera un momento";
  return "No pudimos completar la acción";
}

/**
 * Cambia el estado de una ficha (comercio o servicio) desde los listados admin
 * (`PATCH /admin/listings/:id/status`, CLGDC-120). `REJECTED` exige el motivo (lo lee el dueño).
 * Refresca el panel (listados y contador de Moderación) y la página pública de la ficha.
 */
export async function setAdminListingStatusAction(
  id: string,
  slug: string,
  status: IAdminPublicationStatus,
  reason?: string,
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, message: "Elemento inválido." };
  // `ARCHIVED` no se asigna desde el panel (la API responde 400).
  if (!(ADMIN_SETTABLE_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, message: "Estado inválido." };
  }
  const why = typeof reason === "string" ? reason.trim().slice(0, 500) : "";
  if (status === "REJECTED" && !why) return { ok: false, message: "Escribe el motivo del rechazo." };

  try {
    await adminListingsService.setStatus(id, status, status === "REJECTED" ? why : undefined);
  } catch (e) {
    return { ok: false, message: friendlyError(e) };
  }

  revalidatePath("/dashboard", "layout");
  if (typeof slug === "string" && SLUG.test(slug)) {
    revalidatePath(`/comercio/${slug}`);
    revalidatePath(`/servicio/${slug}`);
  }
  return { ok: true };
}
