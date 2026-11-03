import { LDCCityForm } from "@/components/organisms/ldc-city-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { adminRegionsService } from "@/services/admin/regions";
import { cityToValues } from "@/validations/admin-catalog-schema";
import { createCityAction } from "../actions";

export const metadata = {
  title: "Nueva ciudad — Panel",
};

export default async function NewCityPage() {
  const regions = await adminRegionsService.list();
  return (
    <LDCDashboardPageTemplate title="Nueva ciudad" description="Define el nombre, el slug y su región.">
      <LDCCityForm
        mode="create"
        action={createCityAction}
        returnHref="/dashboard/admin/ciudades"
        initial={cityToValues()}
        regions={regions.map(({ id, name, slug }) => ({ id, name, slug }))}
      />
    </LDCDashboardPageTemplate>
  );
}
