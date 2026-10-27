import type { ReactNode } from "react";
import { LDCRoleIcon } from "@/components/atoms/ldc-role-icon";
import type { LDCRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

export interface LDCAuthHeaderProps {
  /** Título de la página (h1) */
  title: ReactNode;
  /** Texto bajo el título */
  description?: ReactNode;
  /** Rol cuyo ícono va sobre el título (opcional) */
  role?: LDCRole;
  /** Alineación: `center` en tarjeta, `start` en pantalla dividida */
  align?: "center" | "start";
  /** Tamaño del título: `default` text-xl, `lg` text-2xl */
  size?: "default" | "lg";
  /** Clases adicionales */
  className?: string;
}

/**
 * LDCAuthHeader - Encabezado de las páginas de acceso
 *
 * Ícono del rol, h1 con el estilo de marca (font-black, blue-gray/blanco, como
 * `LDCSectionHeader`, que es un h2 de sección) y descripción en Open Sans.
 *
 * @example
 * <LDCAuthHeader role="admin" title="Panel de administración" description="…" align="start" size="lg" />
 */
export function LDCAuthHeader({
  title,
  description,
  role,
  align = "center",
  size = "default",
  className,
}: LDCAuthHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {role && <LDCRoleIcon role={role} />}
      <h1
        className={cn(
          "font-mulish font-black leading-tight text-balance text-blue-gray dark:text-white",
          size === "lg" ? "text-2xl" : "text-xl"
        )}
      >
        {title}
      </h1>
      {description != null && (
        <p className="font-open-sans text-sm text-balance text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
