import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Clases por variante: enlace, texto (se despliega al hover en desktop) e ícono.
 * Copiadas tal cual de las cards para mantener la paridad visual.
 */
const detailsLinkVariants = {
  /** Footer de card de comercio/servicio. */
  default: {
    link: "group/link flex items-center gap-1 text-sm text-pink dark:text-yellow hover:text-orange dark:hover:text-orange transition-colors flex-shrink-0",
    label:
      "md:max-w-0 md:opacity-0 md:group-hover/link:max-w-24 md:group-hover/link:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap",
    icon: "w-4 h-4",
  },
  /** Igual que `default`, con el texto en `font-medium` (post de noticia). */
  emphasis: {
    link: "group/link flex items-center gap-1 text-sm text-pink dark:text-yellow hover:text-orange dark:hover:text-orange transition-colors flex-shrink-0",
    label:
      "font-medium md:max-w-0 md:opacity-0 md:group-hover/link:max-w-24 md:group-hover/link:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap",
    icon: "w-4 h-4",
  },
  /** Card horizontal de aviso: se despliega desde `sm` y la flecha es más grande. */
  compact: {
    link: "group/link flex items-center gap-1 text-sm text-pink dark:text-yellow hover:text-orange transition-colors",
    label:
      "sm:max-w-0 sm:opacity-0 sm:group-hover/link:max-w-20 sm:group-hover/link:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap",
    icon: "w-5 h-5",
  },
} as const;

export type LDCDetailsLinkVariant = keyof typeof detailsLinkVariants;

interface LDCDetailsLinkProps {
  /** Destino del enlace */
  href: string;
  /** Texto (por defecto «Ver detalles»; la card de aviso usa «Ver más») */
  label?: string;
  /** Variante visual */
  variant?: LDCDetailsLinkVariant;
  /** Optional className for custom styling (va al enlace) */
  className?: string;
}

/**
 * LDCDetailsLink - Enlace «Ver detalles» con flecha
 *
 * En desktop solo se ve la flecha y el texto se despliega al pasar el cursor;
 * en móvil el texto queda siempre visible.
 *
 * @example
 * ```tsx
 * <LDCDetailsLink href={`/${type}/${slug}`} />
 * <LDCDetailsLink href={`/aviso/${slug}`} label="Ver más" variant="compact" />
 * ```
 */
export function LDCDetailsLink({
  href,
  label = "Ver detalles",
  variant = "default",
  className,
}: LDCDetailsLinkProps) {
  const classes = detailsLinkVariants[variant];

  return (
    <Link href={href} className={cn(classes.link, className)}>
      <span className={classes.label}>{label}</span>
      <ChevronRight className={classes.icon} />
    </Link>
  );
}
