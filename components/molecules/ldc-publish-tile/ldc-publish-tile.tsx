import Link from "next/link";
import { LDCRoleIcon, type LDCRoleIconProps } from "@/components/atoms/ldc-role-icon";
import type { LDCRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

export interface LDCPublishTileProps {
  /** Rol que da el tipo: pone el ícono y su color */
  role: LDCRole;
  /** Ícono y color propios en vez de los del rol (ver `LDCRoleIcon`) */
  icon?: LDCRoleIconProps["icon"];
  /** Destino del enlace (el formulario del tipo) */
  href: string;
  /** Etiqueta visible, de una palabra («Comercio», «Aviso»…) */
  label: string;
  /** Descripción del tipo: no se ve; el nombre accesible es «{label}: {description}» */
  description: string;
  /** Clases adicionales (van al enlace) */
  className?: string;
}

/**
 * LDCPublishTile - Tile-enlace de un tipo de publicación (CLGDC-203)
 *
 * Ícono del rol en `lg` (48 px) y una palabra; la descripción va en `sr-only`. Toda la tile es el
 * enlace. Vertical y centrada; si su contenedor (el `li` con `@container`) mide 17rem o más, como
 * pasa con 1 a 3 opciones, se vuelve horizontal. Al pasar el cursor cambian el borde (rosado en
 * claro, amarillo en oscuro) y la sombra, y el ícono crece a 1,06 (150 ms, `ease-out`; sin
 * escala con `prefers-reduced-motion`). El foco es un anillo de 3 px `pink-strong` en claro y
 * `yellow` en oscuro, separado 2 px. Server Component: el ícono se resuelve por nombre en
 * `LDCRoleIcon`. La usa `LDCPublishChooser`.
 *
 * @example
 * <li className="@container flex">
 *   <LDCPublishTile role="comercio" href="/dashboard/publicar?tipo=comercio" label="Comercio" description="Un local o negocio…" />
 * </li>
 */
export function LDCPublishTile({ role, icon, href, label, description, className }: LDCPublishTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-26 w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-center text-card-foreground",
        "transition-[border-color,box-shadow] duration-150 ease-out hover:border-pink/60 hover:shadow-lg dark:hover:border-yellow/60 motion-reduce:transition-none",
        "focus-visible:ring-[3px] focus-visible:ring-pink-strong focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none dark:focus-visible:ring-yellow",
        "@[17rem]:min-h-20 @[17rem]:flex-row @[17rem]:justify-start @[17rem]:gap-3.5 @[17rem]:text-left",
        className
      )}
    >
      <LDCRoleIcon
        role={role}
        icon={icon}
        size="lg"
        className="transition-transform duration-150 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {/* El nombre accesible va entero en `sr-only` («Comercio: Un local…»): si la palabra visible y
          la descripción fueran dos nodos, el árbol de accesibilidad mete un espacio antes de los
          dos puntos, porque `sr-only` es `position: absolute`. */}
      <span aria-hidden="true" className="font-mulish text-sm leading-5 font-extrabold">
        {label}
      </span>
      <span className="sr-only">{`${label}: ${description}`}</span>
    </Link>
  );
}
