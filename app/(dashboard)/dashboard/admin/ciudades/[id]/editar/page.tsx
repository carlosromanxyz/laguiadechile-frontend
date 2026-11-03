import { notFound } from "next/navigation";
import { LDCCityForm } from "@/components/organisms/ldc-city-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminCitiesService } from "@/services/admin/cities";
import { adminRegionsService } from "@/services/admin/regions";
import { cityToValues } from "@/validations/admin-catalog-schema";
import { updateCityAction } from "../../actions";

export const metadata = {
  title: "Editar ciudad — Panel",
};

export default async function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // La API expone `GET /cities/:slug`, no por id: se busca en el listado completo.
  const [cities, regions] = await Promise.all([
    adminCitiesService.list({ limit: 500 }),
    adminRegionsService.list(),
  ]);
  const city = cities.find((c) => c.id === id);
  if (!city) notFound();

  return (
    <LDCDashboardPageTemplate title="Editar ciudad" description={city.name}>
      <LDCCityForm
        mode="edit"
        action={updateCityAction.bind(null, city.id)}
        returnHref="/dashboard/admin/ciudades"
        initial={cityToValues(city)}
        regions={regions.map(({ id: regionId, name, slug }) => ({ id: regionId, name, slug }))}
      />
    </LDCDashboardPageTemplate>
  );
}
