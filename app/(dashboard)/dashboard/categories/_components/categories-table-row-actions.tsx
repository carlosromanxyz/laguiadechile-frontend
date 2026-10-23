"use client";

import { LDCResourceRowActions } from "@/components/organisms/ldc-resource-row-actions";
import { deleteCategoryAction } from "@/app/(dashboard)/dashboard/categories/actions";

export function CategoriesTableRowActions({ id }: { id: string }) {
  return (
    <LDCResourceRowActions
      editHref={`/dashboard/categories/${id}/edit`}
      onDelete={() => deleteCategoryAction(id)}
      deleteLabel="¿Eliminar esta categoría?"
    />
  );
}
