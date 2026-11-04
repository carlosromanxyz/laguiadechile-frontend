import { CalendarDays, House, Newspaper, ShieldCheck, Store, Tag, UserRound, Wrench, type LucideIcon } from "lucide-react";
import { LDC_ROLE_META, type LDCRole, type LDCRoleIconName } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

/**
 * Ícono Lucide de cada `LDCRoleIconName`. Se exporta para los Client Components que ponen el ícono
 * del rol dentro de un badge (`LDCBadge role-*`); desde un Server Component, usa `LDCRoleIcon`.
 */
export const LDC_ROLE_ICONS: Record<LDCRoleIconName, LucideIcon> = {
  CalendarDays,
  House,
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
} as const;

export interface LDCRoleIconProps {
  /** Rol cuyo ícono se muestra */
  role: LDCRole;
  /**
   * Ícono y color propios en vez de los del rol, para una opción que no es un rol (la noticia de
   * `LDCPublishChooser`, CLGDC-191)
   */
  icon?: { name: LDCRoleIconName; tone: string };
  /** Tamaño del círculo: `xs` 24 px, `sm` 36 px, `md` 40 px */
  size?: keyof typeof sizes;
  /** Clases adicionales */
  className?: string;
}

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
export function LDCRoleIcon({ role, icon, size = "md", className }: LDCRoleIconProps) {
  const meta = LDC_ROLE_META[role];
  const Icon = LDC_ROLE_ICONS[icon?.name ?? meta.iconName];
  const s = sizes[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        s.box,
        icon?.tone ?? meta.tone,
        className
      )}
    >
      <Icon className={s.icon} />
    </span>
  );
}
