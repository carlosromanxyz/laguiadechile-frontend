import { User } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Perfil y cuenta — Panel",
};

export default function ComercioCuentaPage() {
  return (
    <LDCDashboardPageTemplate title="Perfil y cuenta" description="Tus datos de acceso y de facturación.">
      <LDCPanel>
        <LDCEmptyState
          icon={<User className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
