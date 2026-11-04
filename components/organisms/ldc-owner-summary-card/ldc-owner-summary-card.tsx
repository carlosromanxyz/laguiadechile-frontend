import Link from "next/link";
import { ChartColumn, ChevronRight, CirclePlus, CircleX } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCRoleIcon } from "@/components/atoms/ldc-role-icon";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCStatusCounts, type LDCStatusCountItem } from "@/components/molecules/ldc-status-counts";
import type { LDCRole } from "@/lib/auth/roles";

const numberFormat = new Intl.NumberFormat("es-CL");

export interface LDCOwnerSummaryCardProps {
  /** Rol que da el ícono de la tarjeta */
  role: LDCRole;
  /** «Mis avisos», «Mis comercios»… */
  title: string;
  /** Listado «Mis …» */
  listHref: string;
  /** Publicaciones por estado; si todas suman cero, va el estado vacío */
  counts: LDCStatusCountItem[];
  /** Formulario para publicar una nueva */
  createHref: string;
  /** «Publicar aviso», «Publicar comercio»… */
  createLabel: string;
  /** Texto del estado vacío («Aún no publicas avisos.») */
  emptyText: string;
  /** Visitas y clics de 7 días (fichas), con el enlace a Estadísticas */
  metrics?: { views: number; clicks: number; href: string };
  /** El último rechazo de este grupo, con el motivo */
  rejection?: { title: string; reason: string | null; href: string };
}

/**
 * LDCOwnerSummaryCard - Resumen de un grupo de publicaciones de la cuenta en el inicio del panel
 *
 * Una por rol dueño (avisos, propiedades, comercios, servicios, eventos): conteos por estado que
 * llevan al listado filtrado, visitas y clics de 7 días si es una ficha, el último rechazo con su
 * motivo y el acceso a publicar. Sin publicaciones, un texto corto y el botón para la primera.
 *
 * @example
 * <LDCOwnerSummaryCard role="avisador" title="Mis avisos" listHref="/dashboard/avisos"
 *   counts={counts} createHref="/dashboard/avisos/nuevo" createLabel="Publicar aviso"
 *   emptyText="Aún no publicas avisos." />
 */
export function LDCOwnerSummaryCard({
  role,
  title,
  listHref,
  counts,
  createHref,
  createLabel,
  emptyText,
  metrics,
  rejection,
}: LDCOwnerSummaryCardProps) {
  const total = counts.reduce((sum, c) => sum + c.value, 0);

  return (
    <LDCDashboardCard
      title={
        <span className="flex items-center gap-2">
          <LDCRoleIcon role={role} size="xs" />
          {title}
        </span>
      }
      action={
        total > 0 ? (
          <LDCButton href={listHref} variant="ghost" size="sm">
            Ver todos
            <ChevronRight />
          </LDCButton>
        ) : undefined
      }
    >
      {total === 0 ? (
        <>
          <p className="font-open-sans text-sm text-muted-foreground">{emptyText}</p>
          <LDCButton href={createHref} size="sm" className="mt-3 w-full">
            <CirclePlus />
            {createLabel}
          </LDCButton>
        </>
      ) : (
        <>
          <LDCStatusCounts items={counts} />

          {metrics && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-md border border-border py-1 pr-1 pl-3">
              <p className="font-open-sans text-xs text-muted-foreground">
                Últimos 7 días:{" "}
                <span className="font-bold text-foreground">
                  {numberFormat.format(metrics.views)} {metrics.views === 1 ? "visita" : "visitas"}
                </span>{" "}
                ·{" "}
                <span className="font-bold text-foreground">
                  {numberFormat.format(metrics.clicks)} {metrics.clicks === 1 ? "clic" : "clics"}
                </span>
              </p>
              <LDCButton href={metrics.href} variant="ghost" size="sm">
                <ChartColumn />
                Estadísticas
              </LDCButton>
            </div>
          )}

          {rejection && (
            <Link
              href={rejection.href}
              className="mt-3 flex items-start gap-2 rounded-md border border-destructive px-3 py-2 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
              <span className="min-w-0 font-open-sans text-xs">
                <span className="block truncate font-bold">No aprobamos «{rejection.title}»</span>
                {rejection.reason && (
                  <span className="line-clamp-2 text-muted-foreground">Motivo: {rejection.reason}</span>
                )}
              </span>
            </Link>
          )}

          <LDCButton href={createHref} variant="outline" size="sm" className="mt-3 w-full">
            <CirclePlus />
            {createLabel}
          </LDCButton>
        </>
      )}
    </LDCDashboardCard>
  );
}
