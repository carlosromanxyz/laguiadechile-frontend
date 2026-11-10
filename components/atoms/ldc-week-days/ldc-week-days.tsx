"use client";

import { useChileWeekday } from "@/hooks/use-chile-weekday";
import type { IListingSchedule } from "@/interfaces/listing";
import { DAY_INITIALS, PLACE_DAYS, formatScheduleSummary, isOpenDay } from "@/lib/format/places";
import { cn } from "@/lib/utils";

interface LDCWeekDaysProps {
  schedule: IListingSchedule | undefined;
  /** `sm` (24 px, tarjeta) o `lg` (36 px, ficha; con el día de hoy anillado) */
  size?: "sm" | "lg";
  /** Día de hoy (0 = lunes) que calculó el servidor; en el navegador se recalcula */
  serverToday: number;
  className?: string;
}

/**
 * LDCWeekDays - Los siete días de la semana con los de feria rellenos (alternativa B, CLGDC-207)
 *
 * Círculos L M M J V S D: abiertos en `--place-market` con su foreground; cerrados, con borde. En
 * `lg` el día de hoy (hora de Chile, del navegador) lleva un anillo. El significado no depende del
 * color: el conjunto es `role="img"` con el horario completo en `aria-label`.
 *
 * Cliente solo por el día de hoy (`useChileWeekday`).
 *
 * @example
 * <LDCWeekDays schedule={place.schedule} serverToday={today} size="lg" />
 */
export function LDCWeekDays({ schedule, size = "sm", serverToday, className }: LDCWeekDaysProps) {
  const today = useChileWeekday(serverToday);
  const lg = size === "lg";
  return (
    <span
      role="img"
      aria-label={formatScheduleSummary(schedule)}
      className={cn("flex", lg ? "gap-1.5" : "gap-1", className)}
    >
      {PLACE_DAYS.map((day, i) => {
        const open = isOpenDay(schedule?.[day]);
        return (
          <span
            key={day}
            aria-hidden
            className={cn(
              "grid place-items-center rounded-full border font-mulish font-extrabold",
              lg ? "size-9 text-[13px]" : "size-6 text-[11px]",
              open
                ? "border-place-market bg-place-market text-place-market-foreground"
                : "border-border text-muted-foreground",
              lg && i === today && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
            )}
          >
            {DAY_INITIALS[i]}
          </span>
        );
      })}
    </span>
  );
}
