import { Tags } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Avisos — Panel",
};

export default function AdminAvisosPage() {
  return (
    <LDCDashboardPageTemplate title="Avisos" description="Avisos clasificados, vigentes y vencidos.">
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
