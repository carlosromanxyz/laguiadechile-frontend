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
