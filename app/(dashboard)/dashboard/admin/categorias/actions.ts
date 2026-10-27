"use server";

import { revalidatePath } from "next/cache";
import { adminCategoriesService } from "@/services/admin/categories";

export async function createCategoryAction(input: {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}) {
  const created = await adminCategoriesService.create(input);
  revalidatePath("/dashboard/admin/categorias");
  return created;
}

export async function updateCategoryAction(
  id: string,
  input: { name?: string; slug?: string; description?: string | null; icon?: string | null },
) {
  const updated = await adminCategoriesService.update(id, input);
  revalidatePath("/dashboard/admin/categorias");
  return updated;
}

export async function deleteCategoryAction(id: string) {
  const result = await adminCategoriesService.remove(id);
  revalidatePath("/dashboard/admin/categorias");
  return result;
}
