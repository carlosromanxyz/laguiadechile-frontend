import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LDCEmptyStateProps {
  /**
   * Ícono ya renderizado (JSX), p. ej.
   * `<Search className="w-12 h-12 text-muted-foreground" />`.
   * Se pasa como JSX y no como componente para que funcione igual
   * desde Server y Client Components.
   */
  icon: ReactNode;
  /** Título */
  title: ReactNode;
  /** Texto de apoyo opcional */
  description?: ReactNode;
  /** Acción opcional (p. ej. un LDCCTAButton con `className="mt-6"`) */
  action?: ReactNode;
  /** Clases adicionales para el contenedor */
  className?: string;
}

/**
 * LDCEmptyState - Estado vacío: ícono en círculo, título, texto y acción opcional.
 *
 * No incluye la sección envolvente: el consumidor lo pone dentro de LDCSection.
 *
 * @example
 * ```tsx
 * <LDCSection paddingY="lg">
 *   <LDCEmptyState
 *     icon={<Search className="w-12 h-12 text-muted-foreground" />}
 *     title="No se encontraron avisos"
 *     description="Intenta ajustar los filtros o vuelve más tarde."
 *   />
 * </LDCSection>
 * ```
 */
export function LDCEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: LDCEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground max-w-md">{description}</p>
      )}
      {action}
    </div>
  );
}
