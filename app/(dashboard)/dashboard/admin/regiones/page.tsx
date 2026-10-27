import { Map } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Regiones — Panel",
};

export default function AdminRegionesPage() {
  return (
    <LDCDashboardPageTemplate title="Regiones" description="Regiones del catálogo.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Map className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
