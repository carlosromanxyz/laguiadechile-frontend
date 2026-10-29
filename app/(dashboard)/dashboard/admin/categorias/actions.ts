"use server";

import { revalidatePath } from "next/cache";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { adminCategoriesService } from "@/services/admin/categories";

// Cada acción revalida el rol: una server action se puede invocar sin pasar por el layout.

export async function createCategoryAction(input: {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}) {
  await requireDashboardRole("admin");
  const created = await adminCategoriesService.create(input);
  revalidatePath("/dashboard/admin/categorias");
  return created;
}

export async function updateCategoryAction(
  id: string,
  input: { name?: string; slug?: string; description?: string | null; icon?: string | null },
) {
  await requireDashboardRole("admin");
  const updated = await adminCategoriesService.update(id, input);
  revalidatePath("/dashboard/admin/categorias");
  return updated;
}

export async function deleteCategoryAction(id: string) {
  await requireDashboardRole("admin");
  const result = await adminCategoriesService.remove(id);
  revalidatePath("/dashboard/admin/categorias");
  return result;
}
