import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { LDCRoleIcon } from "@/components/atoms/ldc-role-icon";
import { getRoleConfig, type LDCAccessRole, type LDCRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

export type LDCRoleOptionProps = {
  /** Clases adicionales (van al enlace) */
  className?: string;
} & (
  | {
      /** Rol con login: da el ícono, los textos y el destino (`loginPath`) */
      role: LDCAccessRole;
      href?: undefined;
      title?: undefined;
      description?: undefined;
    }
  | {
      /** Rol de la tarjeta: da el ícono y su color */
      role: LDCRole;
      /** Destino del enlace */
      href: string;
      /** Título de la tarjeta */
      title: string;
      /** Texto bajo el título */
      description: string;
    }
);

/**
 * LDCRoleOption - Tarjeta-enlace de un tipo de cuenta
 *
 * Toda la tarjeta es un enlace al login del rol: `LDCRoleIcon`, título y texto
 * del rol (`lib/auth/roles.ts`) y un chevron. Al pasar el cursor, el borde y el
 * chevron toman el color de marca (rosado en claro, amarillo en oscuro) y sube la
 * sombra. La usan `LDCRoleGateway` en `/ingresar` (con los textos del login del rol) y
 * `LDCPublishChooser` en el panel (con `href`, `title` y `description` propios).
 *
 * @example
 * <LDCRoleOption role="comercio" />
 * <LDCRoleOption role="servicio" href="/dashboard/publicar?tipo=servicio" title="Mi servicio" description="…" />
 */
/** Destino y textos: los propios si vienen; si no, los del login del rol. */
function resolveOption(props: LDCRoleOptionProps) {
  if (props.href !== undefined) {
    return { href: props.href, title: props.title, description: props.description };
  }
  const config = getRoleConfig(props.role);
  return { href: config.loginPath, title: config.optionTitle, description: config.optionDescription };
}

export function LDCRoleOption(props: LDCRoleOptionProps) {
  const { role, className } = props;
  const option = resolveOption(props);

  return (
    <Link
      href={option.href}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left text-card-foreground transition-[border-color,box-shadow] duration-150 hover:border-pink/60 hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:hover:border-yellow/60",
        className
      )}
    >
      <LDCRoleIcon role={role} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-mulish text-sm font-extrabold">{option.title}</span>
        <span className="font-open-sans text-xs leading-snug text-muted-foreground">
          {option.description}
        </span>
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-pink dark:group-hover:text-yellow"
        aria-hidden="true"
      />
    </Link>
  );
}
