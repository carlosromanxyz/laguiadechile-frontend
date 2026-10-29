import { ShieldCheck } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import {
  LDCModerationActions,
  type LDCModerationActionsProps,
} from "@/components/molecules/ldc-moderation-actions";
import type { IDashboardModerationItem } from "@/interfaces/dashboard";

export interface LDCModerationQueueProps {
  items: IDashboardModerationItem[];
  /** Página de moderación (destino de «Revisar» si no hay acciones) */
  moderationHref: string;
  /** Server action de aprobar; con `onReject`, muestra los botones Aprobar y Rechazar */
  onApprove?: LDCModerationActionsProps["onApprove"];
  /** Server action de rechazar */
  onReject?: LDCModerationActionsProps["onReject"];
  /** Cuántos mostrar (por defecto, todos) */
  limit?: number;
  /** Muestra la descripción de cada elemento (por defecto `true`) */
  showDescription?: boolean;
}

/**
 * LDCModerationQueue - Cola de moderación del administrador
 *
 * Fichas y avisos en revisión, con quién los envió, cuándo y su descripción en texto plano.
 * Con `onApprove` y `onReject`, cada elemento lleva Aprobar y Rechazar; si no, «Revisar» lleva
 * a la página de moderación.
 *
 * @example
 * <LDCModerationQueue items={queue} moderationHref="/dashboard/admin/moderacion"
 *   onApprove={approveModerationAction} onReject={rejectModerationAction} />
 */
export function LDCModerationQueue({
  items,
  moderationHref,
  onApprove,
  onReject,
  limit,
  showDescription = true,
}: LDCModerationQueueProps) {
  const shown = limit != null ? items.slice(0, limit) : items;
  return (
    <LDCDashboardCard
      title="Cola de moderación"
      action={
        limit != null && items.length > limit ? (
          <LDCButton href={moderationHref} variant="ghost" size="sm">
            Ver las {items.length}
          </LDCButton>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <LDCEmptyState
          className="py-8"
          icon={<ShieldCheck className="size-10 text-muted-foreground" aria-hidden />}
          title="Nada por revisar"
          description="Cuando un comercio o usuario envíe o edite algo, aparecerá aquí."
        />
      ) : (
        <ul>
          {shown.map((item) => (
            <LDCDashboardListItem
              key={`${item.kind}-${item.id}`}
              image={item.image}
              title={item.title}
              subtitle={item.by}
              description={showDescription ? item.description : undefined}
              meta={
                <>
                  {item.kind === "listing" ? (
                    <LDCBadge variant="new">Ficha</LDCBadge>
                  ) : (
                    <LDCBadge variant="updated">Aviso</LDCBadge>
                  )}
                  <span>{item.when}</span>
                </>
              }
              actions={
                onApprove && onReject ? (
                  <LDCModerationActions
                    kind={item.kind}
                    id={item.id}
                    slug={item.slug}
                    title={item.title}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                ) : (
                  <LDCButton href={moderationHref} size="sm">
                    Revisar
                  </LDCButton>
                )
              }
            />
          ))}
        </ul>
      )}
    </LDCDashboardCard>
  );
}
