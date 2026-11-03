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
import { adminCitiesService } from "@/services/admin/cities";
import {
  cityFormSchema,
  toCityPayload,
  type LDCCityFormValues,
} from "@/validations/admin-catalog-schema";

// Cada acción revalida el rol: una server action se puede invocar sin pasar por el layout.
// Una ciudad se ve en todo el sitio (su página, la de su región, fichas y buscadores): se revalida entero.

export async function createCityAction(values: LDCCityFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  const parsed = cityFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminCitiesService.create(toCityPayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateCityAction(
  id: string,
  values: LDCCityFormValues,
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  const parsed = cityFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminCitiesService.update(id, toCityPayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteCityAction(id: string): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  try {
    await adminCitiesService.remove(id);
  } catch (e) {
    return catalogDeleteError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
