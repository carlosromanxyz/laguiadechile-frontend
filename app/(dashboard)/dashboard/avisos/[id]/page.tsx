import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCClassifiedForm } from "@/components/organisms/ldc-classified-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IMyClassified } from "@/interfaces/my-classified";
import { getCategories, getCities } from "@/lib/api/catalog";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyClassifieds } from "@/services/dashboard/usuario";
import { updateMyClassifiedAction } from "../actions";

export const metadata = {
  title: "Editar aviso — Panel",
};

interface EditarAvisoPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edición de un aviso propio (`PATCH /me/classifieds/:id`, queda en revisión). El aviso sale de
 * `GET /me/classifieds` (solo los de la cuenta): si el id no es suyo, 404. Llegan aquí «Editar»,
 * «Renovar» y «Corregir y reenviar» de «Mis avisos».
 */
export default async function EditarAvisoPage({ params }: EditarAvisoPageProps) {
  const [, { id }, classifieds, categories, cities] = await Promise.all([
    requireDashboardRole("avisador"),
    params,
    getMyClassifieds(),
    getCategories(),
    getCities(),
  ]);

  const owned = classifieds.find((c) => c.item.id === id);
  if (!owned) notFound();
  const classified: IMyClassified = {
    ...owned.item,
    status: owned.ownership.status,
    ...(owned.ownership.rejectionReason ? { rejectionReason: owned.ownership.rejectionReason } : {}),
  };

  return (
    <LDCDashboardPageTemplate
      title="Editar aviso"
      description="Al guardar, tu aviso pasa a revisión y vuelve a La Guía cuando lo aprobemos."
      actions={
        classified.status === "published" ? (
          <LDCButton href={`/aviso/${classified.slug}`} variant="outline">
            <ExternalLink aria-hidden />
            Ver en La Guía
          </LDCButton>
        ) : undefined
      }
    >
      <LDCClassifiedForm
        key={classified.id}
        classified={classified}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? "" }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={updateMyClassifiedAction}
      />
    </LDCDashboardPageTemplate>
  );
}
