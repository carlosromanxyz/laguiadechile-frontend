import { Clock, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { IDashboardTask } from "@/interfaces/dashboard";
import { cn } from "@/lib/utils";

export interface LDCTaskItemProps {
  /** `warning`: triángulo naranjo-rojo; `info`: reloj en el color de acento */
  tone: IDashboardTask["tone"];
  /** Título en negrita */
  title: string;
  /** Texto de apoyo */
  description: string;
  /** Botón a la derecha */
  action?: IDashboardTask["action"];
  /** Ícono ya renderizado delante del texto del botón */
  actionIcon?: ReactNode;
}

/**
 * LDCTaskItem - Aviso o tarea del inicio del panel («Para hoy», avisos vencidos)
 *
 * Sobre el `Alert` de shadcn: ícono, título, descripción y un botón a la derecha.
 *
 * @example
 * <LDCTaskItem tone="warning" title="Tienes 2 avisos vencidos" description="…"
 *   action={{ label: "Renovar", href: "/dashboard/avisos" }} actionIcon={<RefreshCw />} />
 */
export function LDCTaskItem({ tone, title, description, action, actionIcon }: LDCTaskItemProps) {
  return (
    <Alert
      role="status"
      className={cn(
        "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr_auto]",
        tone === "warning"
          ? "[&>svg]:text-orange-red"
          : "[&>svg]:text-pink dark:[&>svg]:text-yellow",
      )}
    >
      {tone === "warning" ? <TriangleAlert aria-hidden /> : <Clock aria-hidden />}
      <AlertTitle className="line-clamp-none font-bold">{title}</AlertTitle>
      <AlertDescription className="font-open-sans">{description}</AlertDescription>
      {action && (
        <div className="col-start-3 row-span-2 row-start-1 self-start pl-2">
          <LDCButton href={action.href} variant="outline" size="sm">
            {actionIcon}
            {action.label}
          </LDCButton>
        </div>
      )}
    </Alert>
  );
}
