import { ShieldCheck, Store, Tag, UserRound, Wrench, type LucideIcon } from "lucide-react";
import { LDC_ROLE_META, type LDCRole, type LDCRoleIconName } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const icons: Record<LDCRoleIconName, LucideIcon> = { ShieldCheck, Store, Tag, UserRound, Wrench };

const sizes = {
  xs: { box: "size-6", icon: "size-3.5" },
  sm: { box: "size-9", icon: "size-[18px]" },
  md: { box: "size-10", icon: "size-5" },
} as const;

export interface LDCRoleIconProps {
  /** Rol cuyo ícono se muestra */
  role: LDCRole;
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
export function LDCRoleIcon({ role, size = "md", className }: LDCRoleIconProps) {
  const meta = LDC_ROLE_META[role];
  const Icon = icons[meta.iconName];
  const s = sizes[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        s.box,
        meta.tone,
        className
      )}
    >
      <Icon className={s.icon} />
    </span>
  );
}
