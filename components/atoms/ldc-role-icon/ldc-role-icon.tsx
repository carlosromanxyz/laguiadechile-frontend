import { ShieldCheck, Store, UserRound, type LucideIcon } from "lucide-react";
import { LDC_ROLES, type LDCRole, type LDCRoleIconName } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const icons: Record<LDCRoleIconName, LucideIcon> = { ShieldCheck, Store, UserRound };

/** Fondo de marca y color del ícono por rol (contraste del ícono ≥ 3:1, WCAG 1.4.11). */
const tones: Record<LDCRole, string> = {
  admin: "bg-purple text-white",
  comercio: "bg-orange text-black",
  usuario: "bg-pink text-white",
};

const sizes = {
  sm: { box: "size-9", icon: "size-[18px]" },
  md: { box: "size-10", icon: "size-5" },
} as const;

export interface LDCRoleIconProps {
  /** Rol cuyo ícono se muestra */
  role: LDCRole;
  /** Tamaño del círculo: `sm` 36 px, `md` 40 px */
  size?: keyof typeof sizes;
  /** Clases adicionales */
  className?: string;
}

/**
 * LDCRoleIcon - Ícono de un rol en un círculo con su color de marca
 *
 * Resuelve el ícono a partir del `iconName` de `lib/auth/roles.ts`, así el
 * componente Lucide nunca cruza de Server a Client. Es decorativo
 * (`aria-hidden`): el nombre del rol lo da el texto que lo acompaña.
 *
 * @example
 * <LDCRoleIcon role="admin" />
 */
export function LDCRoleIcon({ role, size = "md", className }: LDCRoleIconProps) {
  const Icon = icons[LDC_ROLES[role].iconName];
  const s = sizes[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        s.box,
        tones[role],
        className
      )}
    >
      <Icon className={s.icon} />
    </span>
  );
}
