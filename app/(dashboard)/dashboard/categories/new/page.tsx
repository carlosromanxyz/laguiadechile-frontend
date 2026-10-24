import { LDCCategoryForm } from "@/components/organisms/ldc-category-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { createCategoryAction } from "../actions";

export const metadata = {
  title: "Nueva categoría — Dashboard",
};

export default function NewCategoryPage() {
  return (
    <LDCDashboardPageTemplate
      title="Nueva categoría"
      description="Define el nombre, slug y datos asociados."
    >
      <LDCCategoryForm
        mode="create"
        action={createCategoryAction}
        returnHref="/dashboard/categories"
      />
    </LDCDashboardPageTemplate>
  );
}
