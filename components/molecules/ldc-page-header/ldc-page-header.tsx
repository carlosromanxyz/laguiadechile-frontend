import type { ReactNode } from "react";

export interface LDCPageHeaderProps {
  /** Título de la página (h1) */
  title: ReactNode;
  /** Texto bajo el título */
  description?: ReactNode;
  /** Acciones a la derecha del título (p. ej. el botón «Nueva»); en móvil bajan a otra línea */
  actions?: ReactNode;
}

/**
 * LDCPageHeader - Encabezado de las páginas del panel
 *
 * Título de marca (`font-black text-blue-gray dark:text-white`, como `LDCSectionHeader`),
 * descripción y, si hay, acciones alineadas a la derecha.
 *
 * @example
 * <LDCPageHeader title="Categorías" description="Catálogo…" actions={<LDCButton href="/dashboard/admin/categorias/nueva">Nueva</LDCButton>} />
 */
export function LDCPageHeader({ title, description, actions }: LDCPageHeaderProps) {
  const heading = (
    <div className="min-w-0">
      <h1 className="text-2xl font-black tracking-tight text-blue-gray dark:text-white">
        {title}
      </h1>
      {description != null && (
        <p className="mt-0.5 font-open-sans text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );

  if (actions == null) return heading;

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      {heading}
      {actions}
    </div>
  );
}
