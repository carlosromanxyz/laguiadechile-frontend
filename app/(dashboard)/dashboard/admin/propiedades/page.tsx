import { Home } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Propiedades — Panel",
};

export default function AdminPropiedadesPage() {
  return (
    <LDCDashboardPageTemplate title="Propiedades" description="Propiedades en venta y arriendo.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Home className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
