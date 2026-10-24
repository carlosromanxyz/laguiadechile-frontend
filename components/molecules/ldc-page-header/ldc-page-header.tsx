import type { ReactNode } from "react";

export interface LDCPageHeaderProps {
  /** Título de la página (h1) */
  title: ReactNode;
  /** Texto bajo el título */
  description?: ReactNode;
  /** Acciones a la derecha del título (p. ej. el botón «Nueva») */
  actions?: ReactNode;
}

/**
 * LDCPageHeader - Encabezado de las páginas del panel
 *
 * Título, descripción y, si hay, acciones alineadas a la derecha.
 *
 * @example
 * <LDCPageHeader title="Categorías" description="Catálogo…" actions={<Button>Nueva</Button>} />
 */
export function LDCPageHeader({ title, description, actions }: LDCPageHeaderProps) {
  const heading = (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description != null && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );

  if (actions == null) return heading;

  return (
    <div className="flex items-center justify-between gap-2">
      {heading}
      {actions}
    </div>
  );
}
