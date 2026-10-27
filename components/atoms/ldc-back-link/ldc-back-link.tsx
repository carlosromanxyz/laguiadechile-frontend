import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LDCBackLinkProps {
  /** Destino del enlace */
  href: string;
  /** Texto del enlace */
  label: string;
  /** Clases adicionales */
  className?: string;
}

/**
 * LDCBackLink - Enlace de vuelta con flecha a la izquierda
 *
 * Píldora discreta (texto atenuado, fondo `accent` al pasar el cursor) que se
 * alinea al inicio de su columna. La usa el login por rol para volver al
 * repartidor `/ingresar`.
 *
 * @example
 * <LDCBackLink href="/ingresar" label="Cambiar tipo de cuenta" />
 */
export function LDCBackLink({ href, label, className }: LDCBackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 self-start rounded-full py-1 pr-2.5 pl-1.5 font-mulish text-sm font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-pink focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:hover:text-yellow",
        className
      )}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
