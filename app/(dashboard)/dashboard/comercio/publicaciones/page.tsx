import { Store } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Mis publicaciones — Panel",
};

export default function ComercioPublicacionesPage() {
  return (
    <LDCDashboardPageTemplate title="Mis publicaciones" description="Tus fichas y su estado.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Store className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
