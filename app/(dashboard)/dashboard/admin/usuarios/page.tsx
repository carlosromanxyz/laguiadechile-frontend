import { Users } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Usuarios — Panel",
};

export default function AdminUsuariosPage() {
  return (
    <LDCDashboardPageTemplate title="Usuarios" description="Cuentas de comercios y usuarios, y su rol.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Users className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
