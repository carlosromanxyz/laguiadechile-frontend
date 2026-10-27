import { Flag, ShieldCheck } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import type { IDashboardModerationItem } from "@/interfaces/dashboard";

export interface LDCModerationQueueProps {
  items: IDashboardModerationItem[];
  /** Página de moderación (destino de Aprobar/Rechazar mientras no hay backend) */
  moderationHref: string;
  /** Marca el dato como simulado */
  simulated?: boolean;
}

function KindBadge({ kind }: { kind: IDashboardModerationItem["kind"] }) {
  if (kind === "new-listing") return <LDCBadge variant="new">Ficha nueva</LDCBadge>;
  if (kind === "renewal") return <LDCBadge variant="updated">Renovación</LDCBadge>;
  return (
    <LDCBadge variant="status-rejected">
      <Flag className="size-3" aria-hidden />
      Reporte
    </LDCBadge>
  );
}

/**
 * LDCModerationQueue - Cola de moderación del administrador
 *
 * Fichas nuevas, renovaciones y reportes con sus acciones (Aprobar/Rechazar o
 * Despublicar/Descartar, y Ver en el sitio).
 *
 * @example
 * <LDCModerationQueue items={queue} moderationHref="/dashboard/admin/moderacion" simulated />
 */
export function LDCModerationQueue({ items, moderationHref, simulated }: LDCModerationQueueProps) {
  return (
    <LDCDashboardCard title="Cola de moderación" simulated={simulated}>
      {items.length === 0 ? (
        <LDCEmptyState
          className="py-8"
          icon={<ShieldCheck className="size-10 text-muted-foreground" aria-hidden />}
          title="Nada por revisar"
          description="Cuando un comercio o usuario envíe algo, aparecerá aquí."
        />
      ) : (
        <ul>
          {items.map((item) => {
            const isReport = item.kind === "report";
            return (
              <LDCDashboardListItem
                key={item.id}
                image={item.image}
                title={item.title}
                subtitle={item.by}
                meta={
                  <>
                    <KindBadge kind={item.kind} />
                    <span>
                      {item.when} · {item.city}
                    </span>
                  </>
                }
                actions={
                  <>
                    <LDCButton href={moderationHref} size="sm">
                      {isReport ? "Despublicar" : "Aprobar"}
                    </LDCButton>
                    <LDCButton href={moderationHref} variant="outline" size="sm">
                      {isReport ? "Descartar" : "Rechazar"}
                    </LDCButton>
                    <LDCButton href={item.href} variant="ghost" size="sm">
                      Ver
                    </LDCButton>
                  </>
                }
              />
            );
          })}
        </ul>
      )}
    </LDCDashboardCard>
  );
}
