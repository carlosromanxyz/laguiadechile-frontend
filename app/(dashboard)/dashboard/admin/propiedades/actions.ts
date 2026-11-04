"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_SETTABLE_STATUSES,
  type IAdminPublicationStatus,
} from "@/interfaces/admin-publication";
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
import { adminPropertiesService } from "@/services/admin/properties";
import {
  propertyFormSchema,
  toPropertyPayload,
  type LDCPropertyFormValues,
} from "@/validations/admin-catalog-schema";

// Cada acción revalida el rol: una server action se puede invocar sin pasar por el layout.
// Las propiedades se ven en el inicio, en /propiedades y en su página: se revalida el sitio entero.

export async function createPropertyAction(values: LDCPropertyFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  const parsed = propertyFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminPropertiesService.create(toPropertyPayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updatePropertyAction(
  id: string,
  values: LDCPropertyFormValues,
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  const parsed = propertyFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminPropertiesService.update(id, toPropertyPayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deletePropertyAction(id: string): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  try {
    await adminPropertiesService.remove(id);
  } catch (e) {
    return catalogDeleteError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Borra desde el formulario de edición y vuelve al listado (la página de la propiedad ya no existe). */
export async function deletePropertyAndReturnAction(id: string): Promise<IDashboardActionResult> {
  const result = await deletePropertyAction(id);
  if (!result.ok) return result;
  redirect("/dashboard/admin/propiedades");
}

const SLUG = /^[a-z0-9-]{1,200}$/;

/** Texto fijo para el usuario según el status de la API (nunca el mensaje crudo del backend). */
function statusError(e: unknown): string {
  const status = e instanceof ApiError ? e.status : 0;
  if (status === 400) return "Revisa el motivo e inténtalo de nuevo";
  if (status === 409) return "Esta propiedad está archivada y no cambia de estado";
  if (status === 401 || status === 403) return "No tienes permiso";
  if (status === 404) return "Ya no existe";
  if (status === 429) return "Demasiados intentos, espera un momento";
  return "No pudimos completar la acción";
}

/**
 * Cambia el estado de una propiedad desde «Propiedades» del admin (`PATCH
 * /admin/properties/:id/status`, CLGDC-164). `REJECTED` exige el motivo (lo lee el dueño). Refresca
 * el panel (listados y contador de Moderación), el listado público y la página de la propiedad.
 */
export async function setAdminPropertyStatusAction(
  id: string,
  slug: string,
  status: IAdminPublicationStatus,
  reason?: string,
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  // `ARCHIVED` no se asigna desde el panel (la API responde 400).
  // Tampoco `EXPIRED`: las propiedades no vencen (CLGDC-164).
  if (!(ADMIN_SETTABLE_STATUSES as readonly string[]).includes(status) || status === "EXPIRED") {
    return { ok: false, message: "Estado inválido." };
  }
  const why = typeof reason === "string" ? reason.trim().slice(0, 500) : "";
  if (status === "REJECTED" && !why) return { ok: false, message: "Escribe el motivo del rechazo." };

  try {
    await adminPropertiesService.setStatus(id, status, status === "REJECTED" ? why : undefined);
  } catch (e) {
    return { ok: false, message: statusError(e) };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/propiedades");
  if (typeof slug === "string" && SLUG.test(slug)) revalidatePath(`/propiedad/${slug}`);
  return { ok: true };
}
