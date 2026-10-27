import type { ReactNode } from "react";
import { LDCLogo } from "@/components/atoms/ldc-logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LDCRole } from "@/lib/auth/roles";
import { LDCAuthHeader } from "@/components/molecules/ldc-auth-header";

export interface LDCAuthCardProps {
  /** Título (h1) */
  title: ReactNode;
  /** Subtítulo bajo el título */
  description?: ReactNode;
  /** Rol cuyo ícono va sobre el título (opcional) */
  role?: LDCRole;
  /**
   * Sin la carcasa `Card` ni el logo: encabezado alineado a la izquierda y el
   * formulario debajo. Lo usa la pantalla dividida, donde el logo va en la barra
   * de `LDCAuthTemplate`.
   * @default false
   */
  bare?: boolean;
  /**
   * Enlace de vuelta sobre el encabezado (p. ej. `LDCBackLink` a `/ingresar`).
   * Solo con `bare`.
   */
  back?: ReactNode;
  /** Contenido (el formulario) */
  children: ReactNode;
}

/**
 * LDCAuthCard - Bloque de autenticación: encabezado y formulario
 *
 * En tarjeta (por defecto): `Card` centrada con `LDCLogo` y `LDCAuthHeader`.
 * Con `bare`: sin tarjeta ni logo, encabezado a la izquierda (pantalla dividida).
 *
 * @example
 * <LDCAuthCard bare role="admin" title="Panel de administración" description="…">
 *   <LDCLoginForm role="admin" />
 * </LDCAuthCard>
 */
export function LDCAuthCard({
  title,
  description,
  role,
  bare = false,
  back,
  children,
}: LDCAuthCardProps) {
  if (bare) {
    return (
      <div className="flex w-full flex-col gap-6">
        {back}
        <LDCAuthHeader role={role} title={title} description={description} align="start" size="lg" />
        {children}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="justify-items-center gap-4 text-center">
        <LDCLogo isotipoSize="sm" />
        <LDCAuthHeader role={role} title={title} description={description} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
