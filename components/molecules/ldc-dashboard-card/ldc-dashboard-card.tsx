import type { ReactNode } from "react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { cn } from "@/lib/utils";

export interface LDCDashboardCardProps {
  /** Título de la tarjeta (h2) */
  title: ReactNode;
  /** Acción a la derecha del título (p. ej. un `LDCButton` «Ver todas») */
  action?: ReactNode;
  /** Marca el contenido como simulado (badge «Simulado» a la derecha) */
  simulated?: boolean;
  /**
   * `panel` (por defecto): dentro de `LDCPanel`. `plain`: solo título y contenido, para
   * contenido que ya trae su propia carcasa (p. ej. `LDCResourceTable`).
   */
  variant?: "panel" | "plain";
  /** Contenido */
  children: ReactNode;
  /** Clases adicionales del contenedor */
  className?: string;
}

/**
 * LDCDashboardCard - Tarjeta de contenido del inicio del panel
 *
 * `LDCPanel` con un encabezado (título, badge «Simulado» y acción). Base de las tarjetas
 * del inicio de cada rol (moderación, visitas, favoritos, contacto…).
 *
 * @example
 * <LDCDashboardCard title="Favoritos recientes" simulated>…</LDCDashboardCard>
 * <LDCDashboardCard title="Mis publicaciones" variant="plain" action={<LDCButton href="/dashboard/comercio/publicaciones" variant="ghost" size="sm">Ver todas</LDCButton>}>
 *   <LDCResourceTable … />
 * </LDCDashboardCard>
 */
export function LDCDashboardCard({
  title,
  action,
  simulated,
  variant = "panel",
  children,
  className,
}: LDCDashboardCardProps) {
  const header = (
    <div className="mb-3 flex min-h-8 items-center justify-between gap-2">
      <h2 className="text-base font-extrabold">{title}</h2>
      {(simulated || action) && (
        <div className="flex shrink-0 items-center gap-2">
          {simulated && <LDCBadge variant="simulated">Simulado</LDCBadge>}
          {action}
        </div>
      )}
    </div>
  );

  if (variant === "plain") {
    return (
      <section className={cn("min-w-0", className)}>
        {header}
        {children}
      </section>
    );
  }

  return (
    <LDCPanel as="section" className={cn("min-w-0 p-4", className)}>
      {header}
      {children}
    </LDCPanel>
  );
}
