import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export interface LDCShareOptionProps {
  /** Ícono (Lucide o `react-icons`); se pinta en un chip neutro y hereda `currentColor` */
  icon: ComponentType<{ className?: string }>;
  /** Texto visible; también es el nombre accesible */
  label: string;
  /**
   * `row`: fila de 44 px para el popover de escritorio.
   * `tile`: tile de 80 px de alto (ícono arriba, texto abajo) para la grilla de 3 columnas del sheet móvil.
   * @default "row"
   */
  variant?: "row" | "tile";
  /** Si existe, la opción es un enlace; si no, un botón */
  href?: string;
  /** Abre en pestaña nueva con `rel="noopener noreferrer"` (redes sociales) */
  external?: boolean;
  /** Acción del botón (copiar, compartir nativo) */
  onClick?: () => void;
  /** Texto secundario a la derecha, solo en `row` (p. ej. «del teléfono») */
  hint?: string;
  /** `success`: estado «Enlace copiado» (ícono y texto en `text-success`) */
  tone?: "default" | "success";
  /** Clase extra para el ícono (p. ej. la animación del check) */
  iconClassName?: string;
  className?: string;
}

const BASE =
  "group/share-option cursor-pointer text-foreground no-underline transition-colors duration-150 motion-reduce:transition-none hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink dark:focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const VARIANT = {
  row: {
    root: "flex w-full min-h-11 items-center gap-3 rounded-md px-3 py-1.5 text-left text-sm font-semibold",
    chip: "size-8",
    icon: "size-4",
  },
  tile: {
    root: "flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-center text-xs font-bold",
    chip: "size-12",
    icon: "size-5",
  },
} as const;

/**
 * LDCShareOption - Una opción del menú de compartir
 *
 * Chip neutro (`bg-muted`, sin colores de marca) con el ícono; al pasar el cursor el fondo pasa a
 * `bg-muted` y el ícono toma el acento del tema (`text-pink dark:text-yellow`). Se renderiza como
 * `<a>` si recibe `href` (con `target="_blank" rel="noopener noreferrer"` si es `external`) o como
 * `<button type="button">` si no. El texto visible es el nombre accesible.
 *
 * @example
 * <LDCShareOption icon={FaWhatsapp} label="WhatsApp" href={waUrl} external />
 * <LDCShareOption icon={Link} label="Copiar enlace" onClick={copy} variant="tile" />
 */
export function LDCShareOption({
  icon: Icon,
  label,
  variant = "row",
  href,
  external = false,
  onClick,
  hint,
  tone = "default",
  iconClassName,
  className,
}: LDCShareOptionProps) {
  const styles = VARIANT[variant];
  const success = tone === "success";

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          "inline-grid shrink-0 place-items-center rounded-full bg-muted transition-colors duration-150 motion-reduce:transition-none",
          "group-hover/share-option:bg-card group-hover/share-option:text-pink dark:group-hover/share-option:text-yellow",
          success ? "text-success group-hover/share-option:text-success dark:group-hover/share-option:text-success" : "text-foreground",
          styles.chip,
        )}
      >
        <Icon className={cn(styles.icon, iconClassName)} />
      </span>
      <span className={cn(success && "text-success")}>{label}</span>
      {hint && variant === "row" && (
        <span className="ml-auto text-xs font-medium text-muted-foreground">{hint}</span>
      )}
    </>
  );

  const classes = cn(BASE, styles.root, className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
