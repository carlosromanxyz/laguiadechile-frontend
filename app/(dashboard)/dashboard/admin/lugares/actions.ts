"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_SETTABLE_STATUSES, type IAdminPublicationStatus } from "@/interfaces/admin-publication";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { ApiError } from "@/lib/api-client";
import {
  catalogDeleteError,
  catalogSaveError,
  INVALID_FORM,
  INVALID_ID,
  isUuid,
} from "@/lib/dashboard/admin-catalog-errors";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { adminPlacesService } from "@/services/admin/places";
import { placeFormSchema, toPlacePayload, type LDCPlaceFormValues } from "@/validations/place-form-schema";

// Cada acción revalida el rol: una server action se puede invocar sin pasar por el layout.
// Los lugares se ven en /lugares, en su ficha, en la página de su ciudad y en /resultados: se
// revalida el sitio entero.

export async function createPlaceAction(values: LDCPlaceFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  const parsed = placeFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminPlacesService.create(toPlacePayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Lee el lugar guardado (`GET /admin/places/:id`, cualquier estado) para reenviar su HTML original
 * si el texto de la descripción no cambió.
 */
export async function updatePlaceAction(id: string, values: LDCPlaceFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  const parsed = placeFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    const current = await adminPlacesService.get(id);
    await adminPlacesService.update(id, toPlacePayload(parsed.data, current.description));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return { ok: false, message: "Este lugar ya no existe." };
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deletePlaceAction(id: string): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  try {
    await adminPlacesService.remove(id);
  } catch (e) {
    return catalogDeleteError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Borra desde el formulario de edición y vuelve al listado (la página del lugar ya no existe). */
export async function deletePlaceAndReturnAction(id: string): Promise<IDashboardActionResult> {
  const result = await deletePlaceAction(id);
  if (!result.ok) return result;
  redirect("/dashboard/admin/lugares");
}

const SLUG = /^[a-z0-9-]{1,200}$/;

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function statusError(e: unknown): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return "Revisa el motivo e inténtalo de nuevo";
  if (status === 409) return "Este lugar está archivado y no cambia de estado";
  if (status === 401 || status === 403) return "No tienes permiso";
  if (status === 404) return "Ya no existe";
  if (status === 429) return "Demasiados intentos, espera un momento";
  return "No pudimos completar la acción";
}

/**
 * Cambia el estado de un lugar desde «Lugares» del admin (`PATCH /admin/places/:id/status`,
 * CLGDC-209). `REJECTED` exige el motivo (lo lee el dueño). Refresca el panel (listados y contador
 * de Moderación), el directorio público y la página del lugar.
 */
export async function setAdminPlaceStatusAction(
  id: string,
  slug: string,
  status: IAdminPublicationStatus,
  reason?: string,
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  // `ARCHIVED` no se asigna desde el panel (la API responde 400); `EXPIRED` tampoco: los lugares no vencen.
  if (!(ADMIN_SETTABLE_STATUSES as readonly string[]).includes(status) || status === "EXPIRED") {
    return { ok: false, message: "Estado inválido." };
  }
  const why = typeof reason === "string" ? reason.trim().slice(0, 500) : "";
  if (status === "REJECTED" && !why) return { ok: false, message: "Escribe el motivo del rechazo." };

  try {
    await adminPlacesService.setStatus(id, status, status === "REJECTED" ? why : undefined);
  } catch (e) {
    return { ok: false, message: statusError(e) };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/lugares");
  if (typeof slug === "string" && SLUG.test(slug)) revalidatePath(`/lugar/${slug}`);
  return { ok: true };
}
