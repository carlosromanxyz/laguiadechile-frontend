import { Newspaper } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Noticias — Panel",
};

export default function AdminNoticiasPage() {
  return (
    <LDCDashboardPageTemplate title="Noticias" description="Noticias publicadas y borradores.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Newspaper className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
