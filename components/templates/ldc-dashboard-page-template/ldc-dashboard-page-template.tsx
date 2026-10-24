import type { ReactNode } from "react";
import { LDCPageHeader } from "@/components/molecules/ldc-page-header";

export interface LDCDashboardPageTemplateProps {
  /** Título de la página */
  title: ReactNode;
  /** Descripción bajo el título */
  description?: ReactNode;
  /** Acciones del encabezado */
  actions?: ReactNode;
  /** Contenido de la página */
  children: ReactNode;
}

/**
 * LDCDashboardPageTemplate - Estructura de página del panel
 *
 * Server Component sin datos: encabezado (LDCPageHeader) y contenido.
 *
 * @example
 * <LDCDashboardPageTemplate title="Categorías" description="…" actions={…}>
 *   <LDCResourceTable … />
 * </LDCDashboardPageTemplate>
 */
export function LDCDashboardPageTemplate({
  title,
  description,
  actions,
  children,
}: LDCDashboardPageTemplateProps) {
  return (
    <div className="space-y-6">
      <LDCPageHeader title={title} description={description} actions={actions} />
      {children}
    </div>
  );
}
