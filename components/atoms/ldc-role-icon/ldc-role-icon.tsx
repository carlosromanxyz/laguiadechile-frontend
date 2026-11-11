import { CalendarDays, House, MapPin, Newspaper, ShieldCheck, Store, Tag, UserRound, Wrench, type LucideIcon } from "lucide-react";
import { LDC_ROLE_META, type LDCRole, type LDCRoleIconName } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

/**
 * Ícono Lucide de cada `LDCRoleIconName`. Se exporta para los Client Components que ponen el ícono
 * del rol dentro de un badge (`LDCBadge role-*`); desde un Server Component, usa `LDCRoleIcon`.
 */
export const LDC_ROLE_ICONS: Record<LDCRoleIconName, LucideIcon> = {
  CalendarDays,
  House,
  MapPin,
  Newspaper,
  ShieldCheck,
  Store,
  Tag,
  UserRound,
  Wrench,
};

const sizes = {
  xs: { box: "size-6", icon: "size-3.5" },
  sm: { box: "size-9", icon: "size-[18px]" },
  md: { box: "size-10", icon: "size-5" },
  lg: { box: "size-12", icon: "size-6" },
} as const;

/** Ícono y color propios de una opción, con un nombre de `LDC_ROLE_ICONS` y un `tone` del DS. */
export interface LDCRoleIconGlyph {
  name: LDCRoleIconName;
  tone: string;
}

/**
 * De dónde sale el ícono: de un rol (`role`, con `icon` opcional para cambiarlo, como la noticia de
 * `LDCPublishChooser`, CLGDC-191) o, para una opción que no es un rol, solo de `icon`.
 */
export type LDCRoleIconSource =
  | {
      /** Rol cuyo ícono se muestra */
      role: LDCRole;
      /** Ícono y color propios en vez de los del rol */
      icon?: LDCRoleIconGlyph;
    }
  | {
      role?: undefined;
      /** Ícono y color de una opción sin rol */
      icon: LDCRoleIconGlyph;
    };

export type LDCRoleIconProps = LDCRoleIconSource & {
  /** Tamaño del círculo: `xs` 24 px, `sm` 36 px, `md` 40 px, `lg` 48 px (`LDCPublishTile`) */
  size?: keyof typeof sizes;
  /** Clases adicionales */
  className?: string;
};

/**
 * LDCRoleIcon - Ícono de un rol en un círculo con su color de marca
 *
 * Resuelve el ícono y el color a partir de `LDC_ROLE_META` (`lib/auth/roles.ts`), así el
 * componente Lucide nunca cruza de Server a Client y el color es el mismo del badge `role-*`
 * de `LDCBadge`. Es decorativo
 * (`aria-hidden`): el nombre del rol lo da el texto que lo acompaña.
 *
 * @example
 * <LDCRoleIcon role="admin" />
 */
export function LDCRoleIcon({ size = "md", className, ...source }: LDCRoleIconProps) {
  const glyph = resolveGlyph(source);
  const Icon = LDC_ROLE_ICONS[glyph.name];
  const s = sizes[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        s.box,
        glyph.tone,
        className
      )}
    >
      <Icon className={s.icon} />
    </span>
  );
}

/** `icon` si viene; si no, el ícono y el color del rol. */
function resolveGlyph(source: LDCRoleIconSource): LDCRoleIconGlyph {
  if (source.role === undefined) return source.icon;
  const meta = LDC_ROLE_META[source.role];
  return source.icon ?? { name: meta.iconName, tone: meta.tone };
}
