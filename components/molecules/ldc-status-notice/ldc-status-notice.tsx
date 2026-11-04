import { Archive, CircleCheck, CircleX, Clock, Hourglass } from "lucide-react";
import type { ReactNode } from "react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import { cn } from "@/lib/utils";

/**
 * Insignia, etiqueta y título de cada estado de moderación. La bajada la pone el llamador
 * (`children`); `LDCListingForm` reutiliza la insignia y la etiqueta en su columna de estado.
 */
export const LDC_STATUS_COPY: Record<
  IDashboardPublicationStatus,
  {
    badge: "status-published" | "status-review" | "status-rejected" | "status-expired" | "status-archived";
    label: string;
    title: string;
  }
> = {
  published: { badge: "status-published", label: "Publicada", title: "Tu ficha se ve en la guía" },
  review: { badge: "status-review", label: "En revisión", title: "Estamos revisando tus cambios" },
  rejected: { badge: "status-rejected", label: "Rechazada", title: "No pudimos aprobar tu ficha" },
  expired: { badge: "status-expired", label: "Vencida", title: "Tu ficha está vencida" },
  archived: { badge: "status-archived", label: "Archivada", title: "Tu ficha está archivada" },
};

const ICONS: Record<IDashboardPublicationStatus, ReactNode> = {
  published: <CircleCheck className="text-success" aria-hidden />,
  review: <Hourglass className="text-orange dark:text-yellow" aria-hidden />,
  rejected: <CircleX className="text-destructive" aria-hidden />,
  expired: <Clock className="text-muted-foreground" aria-hidden />,
  archived: <Archive className="text-muted-foreground" aria-hidden />,
};

export interface LDCStatusNoticeProps {
  /** Estado de moderación */
  status: IDashboardPublicationStatus;
  /** Texto bajo el título (cambia según el estado; p. ej. la fecha del envío) */
  children: ReactNode;
  /** Título en vez del de `LDC_STATUS_COPY` (p. ej. en masculino para un aviso) */
  title?: string;
  /**
   * Insignia propia en vez de la `LDCBadge` por defecto (p. ej. `LDCRejectionReasonDialog`, que
   * abre el motivo del rechazo)
   */
  badge?: ReactNode;
  /**
   * Motivo del rechazo que escribió el equipo (texto plano, CLGDC-164): se muestra dentro del aviso,
   * bajo la bajada, conservando los saltos de línea. Solo tiene sentido con `rejected`.
   */
  reason?: string;
  className?: string;
}

/**
 * LDCStatusNotice - Aviso del estado de moderación de una publicación
 *
 * `ui/alert` con `role="status"` (no interrumpe al lector de pantalla), el ícono y el borde del
 * estado, el título y la insignia `status-*` de `LDCBadge`. Con `reason`, el motivo del rechazo va
 * en un bloque con borde rojo bajo la bajada (texto plano, nunca HTML).
 *
 * @example
 * <LDCStatusNotice status="review">Mientras los revisamos, tu ficha no aparece en la guía.</LDCStatusNotice>
 */
export function LDCStatusNotice({ status, children, title, badge, reason, className }: LDCStatusNoticeProps) {
  const copy = LDC_STATUS_COPY[status];
  return (
    <Alert
      role="status"
      className={cn(
        "rounded-xl",
        status === "review" && "border-yellow",
        status === "rejected" && "border-destructive/50",
        className,
      )}
    >
      {ICONS[status]}
      <AlertTitle className="line-clamp-none flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-extrabold">
        <span className={cn(status === "rejected" && "text-destructive")}>{title ?? copy.title}</span>
        {badge ?? <LDCBadge variant={copy.badge}>{copy.label}</LDCBadge>}
      </AlertTitle>
      <AlertDescription className="font-open-sans">
        {reason && (
          <div className="my-1 w-full rounded-r-md border-l-[3px] border-destructive bg-destructive/5 px-3 py-2 text-foreground">
            <p className="font-mulish text-xs font-bold text-destructive">Motivo del rechazo</p>
            <p className="whitespace-pre-line [overflow-wrap:anywhere]">{reason}</p>
          </div>
        )}
        {children}
      </AlertDescription>
    </Alert>
  );
}
