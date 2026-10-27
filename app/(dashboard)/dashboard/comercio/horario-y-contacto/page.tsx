import { Clock } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";

export const metadata = {
  title: "Horario y contacto — Panel",
};

export default function ComercioHorarioYContactoPage() {
  return (
    <LDCDashboardPageTemplate title="Horario y contacto" description="Horario semanal, feriados, teléfono y WhatsApp.">
      <LDCPanel>
        <LDCEmptyState
          icon={<Clock className="size-10 text-muted-foreground" aria-hidden />}
          title="Próximamente"
          description="Esta sección del panel está en construcción."
        />
      </LDCPanel>
    </LDCDashboardPageTemplate>
  );
}
