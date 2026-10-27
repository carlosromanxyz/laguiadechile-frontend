import { Pencil } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Editar ficha — Panel",
};

export default function ComercioFichaPage() {
  return (
    <LDCDashboardPageTemplate title="Editar ficha" description="Descripción, fotos, categoría y redes de tu negocio.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Pencil className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
