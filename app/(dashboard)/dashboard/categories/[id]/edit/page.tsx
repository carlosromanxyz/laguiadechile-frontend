import { notFound } from "next/navigation";
import { adminCategoriesService } from "@/services/admin/categories";
import { CategoryForm } from "../../_components/category-form";

export const metadata = {
  title: "Editar categoría — Dashboard",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // List + find: backend exposes getBySlug, no getById. For pilot, fetch all and find.
  const list = await adminCategoriesService.list({ limit: 200 });
  const category = list.find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar categoría</h1>
        <p className="text-sm text-muted-foreground">{category.name}</p>
      </div>
      <CategoryForm
        mode="edit"
        id={category.id}
        initial={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          icon: category.icon ?? "",
        }}
      />
    </div>
  );
}
