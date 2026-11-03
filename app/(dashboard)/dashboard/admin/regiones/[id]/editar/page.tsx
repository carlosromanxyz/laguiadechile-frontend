import { notFound } from "next/navigation";
import { LDCRegionForm } from "@/components/organisms/ldc-region-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminRegionsService } from "@/services/admin/regions";
import { regionToValues } from "@/validations/admin-catalog-schema";
import { updateRegionAction } from "../../actions";

export const metadata = {
  title: "Editar región — Panel",
};

export default async function EditRegionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // La API expone `GET /regions/:slug`, no por id: se busca en el listado (16 regiones).
  const region = (await adminRegionsService.list()).find((r) => r.id === id);
  if (!region) notFound();

  return (
    <LDCDashboardPageTemplate title="Editar región" description={region.name}>
      <LDCRegionForm
        mode="edit"
        action={updateRegionAction.bind(null, region.id)}
        returnHref="/dashboard/admin/regiones"
        initial={regionToValues(region)}
      />
    </LDCDashboardPageTemplate>
  );
}
