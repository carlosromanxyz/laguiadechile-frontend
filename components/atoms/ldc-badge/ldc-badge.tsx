import { LDC_ROLE_META } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode, Ref } from "react";

/** Base compartida por las variantes clásicas (pill de 12 px, Mulish). */
const baseClasses =
  "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold font-mulish";

/** Variantes que se suman a `baseClasses`. */
const variants = {
  featured: "bg-yellow text-black",
  new: "bg-pink text-white",
  updated: "bg-purple text-white",
  default: "bg-pink dark:bg-purple text-white",
  /** Rol de una cuenta: mismo color que `LDCRoleIcon` (criterio en `LDC_ROLE_META`). */
  "role-usuario": LDC_ROLE_META.usuario.tone,
  "role-avisador": LDC_ROLE_META.avisador.tone,
  "role-comercio": LDC_ROLE_META.comercio.tone,
  "role-servicio": LDC_ROLE_META.servicio.tone,
  "role-admin": LDC_ROLE_META.admin.tone,
  /** Estado de una publicación propia en el panel. */
  "status-published": "gap-1 bg-success text-success-foreground",
  "status-review": "gap-1 border border-yellow bg-transparent text-foreground",
  "status-expired": "gap-1 border border-border bg-muted text-muted-foreground",
  "status-rejected": "gap-1 border border-destructive bg-transparent text-destructive",
} as const;

/**
 * Variantes con clases completas propias (no llevan `baseClasses`). Reproducen,
 * en el mismo orden, los badges que las cards arman hoy a mano.
 */
const standaloneVariants = {
  /** Badge «Destacado» superpuesto en la imagen de la card de aviso (incluye su posición). */
  "featured-overlay":
    "absolute top-2 left-2 flex items-center gap-1 bg-yellow text-black text-xs font-semibold px-2 py-1 rounded-md",
  /** Badge mínimo de solo ícono (destacado) con tooltip, como en la card de propiedad. */
  "featured-icon":
    "flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow text-black cursor-help",
  /** Badge mínimo de solo ícono (nuevo) con tooltip, como en la card de propiedad. */
  "new-icon":
    "flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500 text-white cursor-help",
  /** Tipo de aviso clasificado (card de aviso). */
  "classified-vendo": "inline-block text-xs font-bold px-2 py-0.5 rounded bg-pink text-white",
  "classified-compro": "inline-block text-xs font-bold px-2 py-0.5 rounded bg-purple text-white",
  "classified-arriendo": "inline-block text-xs font-bold px-2 py-0.5 rounded bg-orange text-white",
  "classified-busco": "inline-block text-xs font-bold px-2 py-0.5 rounded bg-yellow text-black",
  "classified-ofrezco":
    "inline-block text-xs font-bold px-2 py-0.5 rounded bg-emerald-500 text-white",
  /** Marca de dato simulado en el panel (borde punteado, 10 px en mayúsculas). */
  simulated:
    "inline-flex items-center whitespace-nowrap rounded-full border border-dashed border-border px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-muted-foreground",
} as const;

export type LDCBadgeVariant = keyof typeof variants | keyof typeof standaloneVariants;

interface LDCBadgeProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "className"> {
  /** Badge content */
  children: ReactNode;
  /** Variant color scheme */
  variant?: LDCBadgeVariant;
  /** Elemento raíz (por defecto `span`) */
  as?: "span" | "div";
  /** Ref al elemento raíz (necesario si va dentro de un `TooltipTrigger asChild`) */
  ref?: Ref<HTMLElement>;
  /** Optional className for custom styling */
  className?: string;
}

function isStandalone(variant: LDCBadgeVariant): variant is keyof typeof standaloneVariants {
  return variant in standaloneVariants;
}

/**
 * LDCBadge - Reusable Badge Component
 *
 * Small label component for displaying status or category information.
 * Used in listing cards for featured, new, and updated indicators.
 * El resto de props (eventos, `data-*`, `aria-*`, `ref`) va al elemento raíz,
 * así funciona como hijo de un `TooltipTrigger asChild`.
 *
 * @example
 * ```tsx
 * <LDCBadge variant="featured">Destacado</LDCBadge>
 * <LDCBadge variant="new">Nuevo</LDCBadge>
 * <LDCBadge variant={`classified-${type}`}>{getClassifiedTypeBadgeLabel(type)}</LDCBadge>
 * <LDCBadge variant="role-comercio">Comercio</LDCBadge>
 * <LDCBadge variant="status-review">En revisión</LDCBadge>
 * <LDCBadge variant="simulated">Simulado</LDCBadge>
 * <LDCBadge as="div" variant="featured-overlay"><Star className="w-3 h-3 fill-current" />Destacado</LDCBadge>
 * ```
 */
export function LDCBadge({
  children,
  variant = "default",
  as: Tag = "span",
  ref,
  className,
  ...props
}: LDCBadgeProps) {
  const classes = isStandalone(variant)
    ? cn(standaloneVariants[variant], className)
    : cn(baseClasses, variants[variant], className);

  return (
    <Tag ref={ref as Ref<HTMLSpanElement & HTMLDivElement>} className={classes} {...props}>
      {children}
    </Tag>
  );
}
