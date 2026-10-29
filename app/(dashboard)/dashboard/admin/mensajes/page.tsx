import { Inbox } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Mensajes — Panel",
};

/** Bandeja de mensajes del formulario de contacto: la página llega con CLGDC-124. */
export default function AdminMensajesPage() {
  return (
    <LDCDashboardPageTemplate title="Mensajes" description="Lo que escriben en el formulario de contacto.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Inbox className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
