"use server";

import { revalidatePath } from "next/cache";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
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
 * Lee el lugar guardado (la API no tiene `GET /places/:id`: se busca en el listado) para reenviar
 * su HTML original si el texto de la descripción no cambió.
 */
export async function updatePlaceAction(id: string, values: LDCPlaceFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  const parsed = placeFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    const current = (await adminPlacesService.list({ limit: 200 })).find((p) => p.id === id);
    if (!current) return { ok: false, message: "Este lugar ya no existe." };
    await adminPlacesService.update(id, toPlacePayload(parsed.data, current.description));
  } catch (e) {
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
