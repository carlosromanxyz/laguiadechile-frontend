import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { LDCBadge, type LDCBadgeVariant } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";

export interface LDCAdminActivityItem {
  id: string;
  title: string;
  /** Listado admin de su tipo, filtrado por su estado */
  href: string;
  /** «Comercio», «Aviso», «Evento»… */
  kindLabel: string;
  statusLabel: string;
  statusBadge: LDCBadgeVariant;
  /** Dueño («Ana Pérez» o «Sin dueño») */
  by: string;
  /** «hace 2 h» */
  when: string;
}

export interface LDCAdminActivityProps {
  items: LDCAdminActivityItem[];
  /** Publicaciones esperando revisión (botón a Moderación) */
  pending: number;
  className?: string;
}

/**
 * LDCAdminActivity - Últimas publicaciones enviadas o moderadas, en el inicio del admin
 *
 * Una fila por publicación con su estado, tipo, dueño y cuándo cambió; el título lleva a su
 * listado admin. Abajo, el acceso a Moderación con los pendientes. Sin filas, un texto corto.
 *
 * @example
 * <LDCAdminActivity items={items} pending={4} />
 */
export function LDCAdminActivity({ items, pending, className }: LDCAdminActivityProps) {
  return (
    <LDCDashboardCard
      title="Actividad reciente"
      className={className}
      action={
        <LDCButton href="/dashboard/admin" variant="ghost" size="sm">
          Resumen
          <ChevronRight />
        </LDCButton>
      }
    >
      {items.length === 0 ? (
        <p className="font-open-sans text-sm text-muted-foreground">
          Cuando alguien publique o edite algo, lo verás aquí.
        </p>
      ) : (
        <ul>
          {items.map((item) => (
            <LDCDashboardListItem
              key={item.id}
              meta={
                <>
                  <LDCBadge variant={item.statusBadge}>{item.statusLabel}</LDCBadge>
                  <span>
                    {item.kindLabel} · {item.when}
                  </span>
                </>
              }
              title={
                <Link href={item.href} className="hover:underline">
                  {item.title}
                </Link>
              }
              subtitle={item.by}
            />
          ))}
        </ul>
      )}
      <LDCButton
        href="/dashboard/admin/moderacion"
        variant={pending > 0 ? "default" : "outline"}
        size="sm"
        className="mt-3 w-full"
      >
        <ShieldCheck />
        {pending > 0
          ? `Moderar ${pending} ${pending === 1 ? "publicación" : "publicaciones"}`
          : "Ir a moderación"}
      </LDCButton>
    </LDCDashboardCard>
  );
}
