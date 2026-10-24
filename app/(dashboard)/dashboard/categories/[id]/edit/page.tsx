import { notFound } from "next/navigation";
import { LDCCategoryForm } from "@/components/organisms/ldc-category-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminCategoriesService } from "@/services/admin/categories";
import { updateCategoryAction } from "../../actions";

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
    <LDCDashboardPageTemplate title="Editar categoría" description={category.name}>
      <LDCCategoryForm
        mode="edit"
        action={updateCategoryAction.bind(null, category.id)}
        returnHref="/dashboard/categories"
        initial={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          icon: category.icon ?? "",
        }}
      />
    </LDCDashboardPageTemplate>
  );
}
