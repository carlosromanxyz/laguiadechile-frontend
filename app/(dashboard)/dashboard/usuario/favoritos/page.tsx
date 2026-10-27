import { Heart } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Favoritos — Panel",
};

export default function UsuarioFavoritosPage() {
  return (
    <LDCDashboardPageTemplate title="Favoritos" description="Comercios, avisos, propiedades y noticias que guardaste.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Heart className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
