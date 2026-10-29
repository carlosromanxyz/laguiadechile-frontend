import Link from "next/link";
import { LDCRoleOption } from "@/components/molecules/ldc-role-option";
import { LDC_PUBLIC_ROLE_KEYS, LDC_REGISTER, type LDCRole } from "@/lib/auth/roles";
import { AUTH_INLINE_LINK_CLASS } from "@/lib/ui/auth";

export interface LDCRoleGatewayProps {
  /**
   * Roles que se ofrecen, en orden. Por defecto, los de login público
   * (comercio y usuario): el administrador no aparece.
   */
  roles?: readonly LDCRole[];
}

/**
 * LDCRoleGateway - Repartidor del acceso común `/ingresar`
 *
 * Lista de `LDCRoleOption` (cada tarjeta es un enlace a `/ingresar/[rol]`)
 * dentro de un `<nav>` etiquetado, y el enlace al registro público (`/registro`).
 * No elige el rol de la cuenta: solo lleva al login con el contexto del rol.
 *
 * @example
 * <LDCAuthCard bare title="Ingresa a La Guía de Chile" description="Elige cómo usas la guía.">
 *   <LDCRoleGateway />
 * </LDCAuthCard>
 */
export function LDCRoleGateway({ roles = LDC_PUBLIC_ROLE_KEYS }: LDCRoleGatewayProps) {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Tipo de cuenta">
        <ul className="flex flex-col gap-2">
          {roles.map((role) => (
            <li key={role}>
              <LDCRoleOption role={role} />
            </li>
          ))}
        </ul>
      </nav>
      <p className="font-open-sans text-sm text-muted-foreground">
        ¿Primera vez?{" "}
        <Link
          href={LDC_REGISTER.path}
          className={AUTH_INLINE_LINK_CLASS}
        >
          Crea tu cuenta
        </Link>
      </p>
    </div>
  );
}
