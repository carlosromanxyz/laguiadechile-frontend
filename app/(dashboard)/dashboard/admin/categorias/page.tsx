import { Plus } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCResourceTable } from "@/components/organisms/ldc-resource-table";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminCategoriesService } from "@/services/admin/categories";
import { deleteCategoryAction } from "./actions";

export const metadata = {
  title: "Categorías — Dashboard",
};

export default async function CategoriesPage() {
  const categories = await adminCategoriesService.list({ limit: 200 });

  return (
    <LDCDashboardPageTemplate
      title="Categorías"
      description="Catálogo de categorías usado por comercios, avisos y noticias."
      actions={
        <LDCButton href="/dashboard/admin/categorias/nueva">
          <Plus className="size-4" />
          Nueva
        </LDCButton>
      }
    >
      <LDCResourceTable
        rows={categories}
        getRowKey={(c) => c.id}
        emptyMessage="Sin categorías todavía."
        columns={[
          { key: "name", header: "Nombre", cellClassName: "font-medium", cell: (c) => c.name },
          {
            key: "slug",
            header: "Slug",
            cellClassName: "font-mono text-xs text-muted-foreground",
            cell: (c) => c.slug,
          },
          {
            key: "description",
            header: "Descripción",
            headClassName: "hidden md:table-cell",
            cellClassName: "hidden max-w-md truncate md:table-cell",
            cell: (c) => c.description ?? "—",
          },
          {
            key: "icon",
            header: "Ícono",
            headClassName: "hidden md:table-cell",
            cellClassName: "hidden md:table-cell",
            cell: (c) =>
              c.icon ? <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.icon}</code> : "—",
          },
        ]}
        getRowActions={(c) => ({
          editHref: `/dashboard/admin/categorias/${c.id}/editar`,
          onDelete: deleteCategoryAction.bind(null, c.id),
          deleteLabel: "¿Eliminar esta categoría?",
        })}
      />
    </LDCDashboardPageTemplate>
  );
}
