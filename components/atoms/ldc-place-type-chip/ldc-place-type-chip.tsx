import { LDCPlaceTypeIcon } from "@/components/atoms/ldc-place-type-icon";
import type { IPlaceType } from "@/interfaces/place";
import { PLACE_TYPE_META } from "@/lib/format/places";
import { PLACE_TONE } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

interface LDCPlaceTypeChipProps {
  type: IPlaceType;
  className?: string;
}

/**
 * LDCPlaceTypeChip - Distintivo tintado del tipo de lugar (alternativa B, CLGDC-207)
 *
 * Pill con el token del tipo al 12 % sobre la card (`color-mix`), el ícono en el token y el nombre
 * en `text-foreground` (más de 15:1). El color nunca va solo: lleva ícono y texto.
 *
 * @example
 * <LDCPlaceTypeChip type="ATTRACTION" />
 */
export function LDCPlaceTypeChip({ type, className }: LDCPlaceTypeChipProps) {
  const tone = PLACE_TONE[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full py-0.5 pl-1.5 pr-2 font-mulish text-xs font-bold leading-5 text-foreground",
        tone.tint,
        className,
      )}
    >
      <LDCPlaceTypeIcon type={type} className={cn("size-3.5 shrink-0", tone.text)} />
      {PLACE_TYPE_META[type].label}
    </span>
  );
}
