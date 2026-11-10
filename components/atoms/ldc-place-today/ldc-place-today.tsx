"use client";

import { useChileWeekday } from "@/hooks/use-chile-weekday";
import type { IListingSchedule } from "@/interfaces/listing";
import type { IPlaceType } from "@/interfaces/place";
import { dayName, placeTodayText } from "@/lib/format/places";
import { cn } from "@/lib/utils";

interface LDCPlaceTodayProps {
  schedule: IListingSchedule | undefined;
  type: IPlaceType;
  /** Día de hoy (0 = lunes) que calculó el servidor; en el navegador se recalcula */
  serverToday: number;
  /**
   * `line` (tarjeta y fila, con el resumen), `fact` (dato rápido de la ficha, solo lo de hoy) o
   * `day` (solo el rótulo «Hoy, martes», en texto plano)
   */
  mode?: "line" | "fact" | "day";
  /** Clases del tramo destacado */
  strongClassName?: string;
}

/**
 * LDCPlaceToday - Qué pasa hoy en un lugar (CLGDC-207)
 *
 * «Hoy 10:00 - 18:00 · Mar a dom · 10:00 - 18:00», «Cerrado hoy», «Abierto las 24 horas», «Hoy hay
 * feria · 07:00 - 16:00» o «Próxima: viernes, …» (`placeTodayText`). El tramo de hoy va en negrita.
 * Cliente solo por el día (`useChileWeekday`): no queda atado a la caché ISR.
 *
 * @example
 * <LDCPlaceToday schedule={p.schedule} type={p.type} serverToday={today} />
 */
export function LDCPlaceToday({ schedule, type, serverToday, mode = "line", strongClassName }: LDCPlaceTodayProps) {
  const today = useChileWeekday(serverToday);
  if (mode === "day") return <>Hoy, {dayName(today).toLowerCase()}</>;
  const text = placeTodayText(schedule, type, today, mode);
  return (
    <>
      <b className={cn("font-semibold text-foreground", strongClassName)}>{text.strong}</b>
      {text.rest && <> · {text.rest}</>}
    </>
  );
}
