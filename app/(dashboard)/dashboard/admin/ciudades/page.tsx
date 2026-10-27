import { MapPin } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Ciudades — Panel",
};

export default function AdminCiudadesPage() {
  return (
    <LDCDashboardPageTemplate title="Ciudades" description="Ciudades del catálogo.">
      <LDCPanel>
        <LDCEmptyState
          icon={<MapPin className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
