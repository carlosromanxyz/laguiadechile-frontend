import { LDCPanel } from "@/components/atoms/ldc-panel";
import { Tag } from "lucide-react";
import type { ReactNode } from "react";

interface LDCPriceBoxProps {
  /** Etiqueta sobre el precio, junto al ícono de etiqueta (p. ej. «Vendo», «Casa en venta») */
  label: ReactNode;
  /** Precio ya formateado */
  price: ReactNode;
  /** Línea opcional bajo el precio (p. ej. gastos comunes) */
  note?: ReactNode;
  /**
   * Ícono de la línea de publicación, ya renderizado
   * (p. ej. `<Clock className="w-4 h-4" />`). Va como JSX para poder cruzar
   * a un client component si hiciera falta.
   */
  metaIcon: ReactNode;
  /** Texto de la línea de publicación (p. ej. «Publicado hace 2 días») */
  meta: ReactNode;
  /** Clases adicionales del panel */
  className?: string;
}

/**
 * LDCPriceBox - Caja de precio del sidebar en las fichas de aviso y propiedad.
 *
 * Panel con la etiqueta (tipo u operación), el precio destacado, una nota
 * opcional y la línea de publicación.
 *
 * @example
 * ```tsx
 * <LDCPriceBox
 *   label="Vendo"
 *   price="$120.000"
 *   metaIcon={<Clock className="w-4 h-4" />}
 *   meta={<>Publicado {relativo}</>}
 * />
 * ```
 */
export function LDCPriceBox({
  label,
  price,
  note,
  metaIcon,
  meta,
  className,
}: LDCPriceBoxProps) {
  return (
    <LDCPanel className={className}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Tag className="w-4 h-4 text-pink" />
        {label}
      </div>
      <p className="text-3xl font-bold font-mulish text-foreground">{price}</p>
      {note && <p className="text-sm text-muted-foreground mt-1">{note}</p>}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
        {metaIcon}
        <span>{meta}</span>
      </div>
    </LDCPanel>
  );
}
