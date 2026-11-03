import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCNewsForm } from "@/components/organisms/ldc-news-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminCategoriesService } from "@/services/admin/categories";
import { newsToValues } from "@/validations/admin-catalog-schema";
import { createNewsAction } from "../actions";

export const metadata = {
  title: "Nueva noticia — Panel",
};

export default async function NewNewsPage() {
  const categories = await adminCategoriesService.list({ limit: 200 });
  return (
    <LDCDashboardPageTemplate
      title="Nueva noticia"
      description="Se publica en el sitio al guardarla."
      actions={<LDCBackLink href="/dashboard/admin/noticias" label="Volver a Noticias" />}
    >
      <LDCNewsForm
        mode="create"
        action={createNewsAction}
        returnHref="/dashboard/admin/noticias"
        initial={newsToValues()}
        categories={categories.map(({ id, name, slug, icon }) => ({ id, name, slug, icon: icon ?? undefined }))}
      />
    </LDCDashboardPageTemplate>
  );
}
