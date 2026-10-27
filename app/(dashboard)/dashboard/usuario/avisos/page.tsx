import { Tags } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Mis avisos — Panel",
};

export default function UsuarioAvisosPage() {
  return (
    <LDCDashboardPageTemplate title="Mis avisos" description="Tus avisos clasificados: renueva, edita o da de baja.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Tags className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
