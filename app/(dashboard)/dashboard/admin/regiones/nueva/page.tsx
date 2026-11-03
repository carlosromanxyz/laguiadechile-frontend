import { LDCRegionForm } from "@/components/organisms/ldc-region-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { regionToValues } from "@/validations/admin-catalog-schema";
import { createRegionAction } from "../actions";

export const metadata = {
  title: "Nueva región — Panel",
};

export default function NewRegionPage() {
  return (
    <LDCDashboardPageTemplate title="Nueva región" description="Define el nombre, el número romano y el slug.">
      <LDCRegionForm
        mode="create"
        action={createRegionAction}
        returnHref="/dashboard/admin/regiones"
        initial={regionToValues()}
      />
    </LDCDashboardPageTemplate>
  );
}
