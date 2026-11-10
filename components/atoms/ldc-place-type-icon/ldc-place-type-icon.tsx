import { Landmark, MountainSnow, ShoppingBasket, type LucideIcon } from "lucide-react";
import type { IPlaceType } from "@/interfaces/place";

const ICONS: Record<IPlaceType, LucideIcon> = {
  ATTRACTION: MountainSnow,
  PUBLIC_SERVICE: Landmark,
  MARKET: ShoppingBasket,
};

interface LDCPlaceTypeIconProps {
  type: IPlaceType;
  className?: string;
}

/**
 * LDCPlaceTypeIcon - Ícono Lucide de un tipo de lugar (CLGDC-207): `MountainSnow` (atractivo),
 * `Landmark` (servicio público) y `ShoppingBasket` (feria o mercado). Decorativo (`aria-hidden`):
 * el tipo siempre va también en texto. Sirve en Server y Client Components porque se elige por
 * `type` (no se pasa el componente del ícono como prop).
 *
 * @example
 * <LDCPlaceTypeIcon type="MARKET" className="size-5 text-place-market" />
 */
export function LDCPlaceTypeIcon({ type, className }: LDCPlaceTypeIconProps) {
  const Icon = ICONS[type];
  return <Icon className={className} aria-hidden />;
}
