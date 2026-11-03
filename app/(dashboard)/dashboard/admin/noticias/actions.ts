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
import { adminNewsService } from "@/services/admin/news";
import {
  newsFormSchema,
  toNewsPayload,
  type LDCNewsFormValues,
} from "@/validations/admin-catalog-schema";

// Cada acción revalida el rol: una server action se puede invocar sin pasar por el layout.
// Las noticias se ven en el inicio, en /noticias y en su página: se revalida el sitio entero.

export async function createNewsAction(values: LDCNewsFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  const parsed = newsFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    await adminNewsService.create(toNewsPayload(parsed.data));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Lee la noticia guardada (la API no tiene `GET /news/:id`: se busca en el listado) para conservar
 * su fecha con hora si el día no cambió y su HTML original si el texto no cambió.
 */
export async function updateNewsAction(id: string, values: LDCNewsFormValues): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  const parsed = newsFormSchema.safeParse(values);
  if (!parsed.success) return INVALID_FORM;
  try {
    const current = (await adminNewsService.list({ limit: 200 })).find((n) => n.id === id);
    if (!current) return { ok: false, message: "Esta noticia ya no existe." };
    await adminNewsService.update(id, toNewsPayload(parsed.data, current.publishedAt, current.content));
  } catch (e) {
    return catalogSaveError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteNewsAction(id: string): Promise<IDashboardActionResult> {
  await requireDashboardRole("admin");
  if (!isUuid(id)) return INVALID_ID;
  try {
    await adminNewsService.remove(id);
  } catch (e) {
    return catalogDeleteError(e);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
