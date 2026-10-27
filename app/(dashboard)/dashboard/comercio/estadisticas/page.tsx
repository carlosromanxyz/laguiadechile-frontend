import { ChartColumn } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Estadísticas — Panel",
};

export default function ComercioEstadisticasPage() {
  return (
    <LDCDashboardPageTemplate title="Estadísticas" description="Visitas y contactos de tus publicaciones.">
      <LDCPanel>
        <LDCEmptyState
          icon={<ChartColumn className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
