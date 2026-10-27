import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

export interface LDCButtonProps {
  /** Contenido (texto y, si hay, un ícono ya renderizado) */
  children: ReactNode;
  /** Destino del enlace (`next/link`) */
  href: string;
  /** Variante del botón de shadcn (por defecto `default`) */
  variant?: ButtonProps["variant"];
  /** Tamaño del botón de shadcn (por defecto `default`) */
  size?: ButtonProps["size"];
  /** Nombre accesible si el botón es solo ícono */
  "aria-label"?: string;
  /** Clases adicionales */
  className?: string;
}

/**
 * LDCButton - Botón-enlace del DS sobre el `Button` de shadcn
 *
 * Envuelve la primitiva `ui/button` para que organismos, plantillas y páginas no la importen
 * directo. Server Component y siempre enlace (`href` obligatorio): las acciones con estado
 * (submit, onClick) siguen usando `Button` dentro de su molécula u organismo cliente.
 *
 * @example
 * <LDCButton href="/" variant="outline"><ExternalLink />Ver el sitio</LDCButton>
 * <LDCButton href="/dashboard/usuario/avisos" size="sm"><RefreshCw />Renovar</LDCButton>
 */
export function LDCButton({
  children,
  href,
  variant,
  size,
  className,
  ...aria
}: LDCButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} {...aria}>
        {children}
      </Link>
    </Button>
  );
}
