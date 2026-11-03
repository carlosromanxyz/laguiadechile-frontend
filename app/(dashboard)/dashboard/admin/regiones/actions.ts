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
import { adminRegionsService } from "@/services/admin/regions";
import {
  regionFormSchema,
  toRegionPayload,
  type LDCRegionFormValues,
} from "@/validations/admin-catalog-schema";

// Cada acción revalida el rol: una server action se puede invocar sin pasar por el layout.
// Una región se ve en todo el sitio (páginas de región, ciudad y buscadores): se revalida entero.

export async function createRegionAction(values: LDCRegionFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  const parsed = regionFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminRegionsService.create(toRegionPayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateRegionAction(
  id: string,
  values: LDCRegionFormValues,
): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  const parsed = regionFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminRegionsService.update(id, toRegionPayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteRegionAction(id: string): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  try {
    await adminRegionsService.remove(id);
  } catch (e) {
    return catalogDeleteError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
