import { notFound } from "next/navigation";
import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCNewsForm } from "@/components/organisms/ldc-news-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminCategoriesService } from "@/services/admin/categories";
import { adminNewsService } from "@/services/admin/news";
import { hasRichHtml, newsToValues } from "@/validations/admin-catalog-schema";
import { updateNewsAction } from "../actions";

export const metadata = {
  title: "Editar noticia — Panel",
};

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // La API expone `GET /news/:slug`, no por id: se busca en el listado (máx. 200).
  const [news, categories] = await Promise.all([
    adminNewsService.list({ limit: 200 }),
    adminCategoriesService.list({ limit: 200 }),
  ]);
  const item = news.find((n) => n.id === id);
  if (!item) notFound();

  return (
    <LDCDashboardPageTemplate
      title="Editar noticia"
      description={item.title}
      actions={<LDCBackLink href="/dashboard/admin/noticias" label="Volver a Noticias" />}
    >
      <LDCNewsForm
        mode="edit"
        action={updateNewsAction.bind(null, item.id)}
        returnHref="/dashboard/admin/noticias"
        initial={newsToValues(item)}
        richContent={hasRichHtml(item.content)}
        categories={categories.map(({ id: categoryId, name, slug, icon }) => ({
          id: categoryId,
          name,
          slug,
          icon: icon ?? undefined,
        }))}
      />
    </LDCDashboardPageTemplate>
  );
}
