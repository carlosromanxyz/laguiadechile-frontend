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
  /** Descripción del tipo: no se ve; es la descripción accesible del enlace (`aria-describedby`) */
  description: string;
  /**
   * Id único del texto de la descripción (p. ej. `publicar-servicio-desc`). Va como prop porque
   * es un Server Component y `useId` no sirve aquí.
   */
  descriptionId: string;
  /** Clases adicionales (van al enlace) */
  className?: string;
}

/**
 * LDCPublishTile - Tile-enlace de un tipo de publicación (CLGDC-203)
 *
 * Ícono del rol en `lg` (48 px) y una palabra, que es el nombre accesible; la descripción no se ve
 * y queda como descripción accesible (`aria-describedby`). Toda la tile es el enlace. Vertical y centrada; si su contenedor (el `li` con `@container`) mide 17rem o más, como
 * pasa con 1 a 3 opciones, se vuelve horizontal. Al pasar el cursor cambian el borde (rosado en
 * claro, amarillo en oscuro) y la sombra, y el ícono crece a 1,06 (150 ms, `ease-out`; sin
 * escala con `prefers-reduced-motion`). El foco es un anillo de 3 px `pink-strong` en claro y
 * `yellow` en oscuro, separado 2 px. Server Component: el ícono se resuelve por nombre en
 * `LDCRoleIcon`. La usa `LDCPublishChooser`.
 *
 * @example
 * <li className="@container flex">
 *   <LDCPublishTile role="comercio" href="/dashboard/publicar?tipo=comercio" label="Comercio" description="Un local o negocio…" descriptionId="publicar-comercio-desc" />
 * </li>
 */
export function LDCPublishTile({
  role,
  icon,
  href,
  label,
  description,
  descriptionId,
  className,
}: LDCPublishTileProps) {
  return (
    <Link
      href={href}
      aria-describedby={descriptionId}
      className={cn(
        "group flex min-h-26 w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-center text-card-foreground",
        "transition-[border-color,box-shadow] duration-150 ease-out hover:border-pink/60 hover:shadow-lg dark:hover:border-yellow/60 motion-reduce:transition-none",
        "focus-visible:ring-[3px] focus-visible:ring-pink-strong focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-hidden dark:focus-visible:ring-yellow",
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
      <span className="font-mulish text-sm leading-5 font-extrabold">{label}</span>
      {/* Descripción accesible: `hidden` y no `sr-only`. Dentro del enlace, un `sr-only` se sumaría
          al nombre; fuera, el lector la leería dos veces en modo lectura. `aria-describedby` sí
          usa el texto de un nodo oculto que referencia. */}
      <span id={descriptionId} hidden>
        {description}
      </span>
    </Link>
  );
}
