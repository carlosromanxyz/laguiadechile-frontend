"use client";

import { useChileWeekday } from "@/hooks/use-chile-weekday";
import type { IListingSchedule } from "@/interfaces/listing";
import { PLACE_DAYS, dayName, isOpenDay } from "@/lib/format/places";
import { cn } from "@/lib/utils";

const dayLabels: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

interface LDCScheduleListProps {
  schedule: IListingSchedule;
  /**
   * Día de hoy (0 = lunes) que calculó el servidor. Si viene, la lista muestra los siete días en
   * orden (los que faltan, «Cerrado») y marca el de hoy con una barra lateral de marca, «(hoy)» y
   * `aria-current="date"`; en el navegador se recalcula. Sin él, el horario tal como está guardado
   * (la ficha de comercio y servicio).
   */
  serverToday?: number;
  className?: string;
}

/**
 * LDCScheduleList - Horario semanal de solo lectura (sale de `LDCListingInfo`, CLGDC-207)
 *
 * Filas «día · horas» con «Cerrado» en `text-destructive`. Sin `serverToday` reproduce el horario de
 * la ficha de comercio tal cual; con `serverToday` (lugares) marca el día de hoy en hora de Chile.
 *
 * @example
 * <LDCScheduleList schedule={listing.schedule} />
 * <LDCScheduleList schedule={place.schedule} serverToday={today} />
 */
export function LDCScheduleList({ schedule, serverToday, className }: LDCScheduleListProps) {
  if (serverToday === undefined) {
    return (
      <div className={cn("space-y-2", className)}>
        {Object.entries(schedule).map(([day, hours]) =>
          hours ? (
            <div key={day} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{dayLabels[day] || day}</span>
              <span
                className={cn(
                  "font-medium",
                  hours.toLowerCase() === "cerrado" ? "text-destructive" : "text-foreground",
                )}
              >
                {hours}
              </span>
            </div>
          ) : null,
        )}
      </div>
    );
  }
  return <PlaceScheduleList schedule={schedule} serverToday={serverToday} className={className} />;
}

function PlaceScheduleList({
  schedule,
  serverToday,
  className,
}: {
  schedule: IListingSchedule;
  serverToday: number;
  className?: string;
}) {
  const today = useChileWeekday(serverToday);
  return (
    <ul className={cn("flex flex-col gap-0.5 text-sm", className)}>
      {PLACE_DAYS.map((day, i) => {
        const hours = schedule[day]?.trim();
        const open = isOpenDay(hours);
        const isToday = i === today;
        return (
          <li
            key={day}
            aria-current={isToday ? "date" : undefined}
            className={cn(
              // Barra lateral en vez de `bg-muted`: «Cerrado» de hoy queda sobre la card (≥ 4,5:1).
              "flex justify-between gap-4 border-l-2 px-2 py-1.5",
              isToday ? "border-pink dark:border-yellow" : "border-transparent",
            )}
          >
            <span className={isToday ? "font-extrabold text-foreground" : "text-muted-foreground"}>
              {dayName(i)}
              {isToday && " (hoy)"}
            </span>
            <span
              className={cn(
                "text-right",
                isToday ? "font-extrabold" : "font-medium",
                open ? "text-foreground" : "text-destructive",
              )}
            >
              {open ? hours : "Cerrado"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
