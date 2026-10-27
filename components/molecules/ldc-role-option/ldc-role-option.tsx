import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { LDCRoleIcon } from "@/components/atoms/ldc-role-icon";
import { getRoleConfig, type LDCRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

export interface LDCRoleOptionProps {
  /** Rol de la tarjeta: da el ícono, los textos y el destino (`loginPath`) */
  role: LDCRole;
  /** Clases adicionales (van al enlace) */
  className?: string;
}

/**
 * LDCRoleOption - Tarjeta-enlace de un tipo de cuenta
 *
 * Toda la tarjeta es un enlace al login del rol: `LDCRoleIcon`, título y texto
 * del rol (`lib/auth/roles.ts`) y un chevron. Al pasar el cursor, el borde y el
 * chevron toman el color de marca (rosado en claro, amarillo en oscuro) y sube la
 * sombra. La usa `LDCRoleGateway` en `/ingresar`.
 *
 * @example
 * <LDCRoleOption role="comercio" />
 */
export function LDCRoleOption({ role, className }: LDCRoleOptionProps) {
  const config = getRoleConfig(role);

  return (
    <Link
      href={config.loginPath}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left text-card-foreground transition-[border-color,box-shadow] duration-150 hover:border-pink/60 hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:hover:border-yellow/60",
        className
      )}
    >
      <LDCRoleIcon role={role} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-mulish text-sm font-extrabold">{config.optionTitle}</span>
        <span className="font-open-sans text-xs leading-snug text-muted-foreground">
          {config.optionDescription}
        </span>
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-pink dark:group-hover:text-yellow"
        aria-hidden="true"
      />
    </Link>
  );
}
