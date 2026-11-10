"use client";

import { useSyncExternalStore } from "react";
import { chileWeekdayIndex } from "@/lib/format/places";

/** Cada cuánto se vuelve a mirar el día (ms). */
const TICK_MS = 60_000;

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, TICK_MS);
  return () => clearInterval(timer);
}

/**
 * Día de la semana en Chile (0 = lunes … 6 = domingo) según el reloj del navegador (CLGDC-207).
 *
 * En el servidor y al hidratar devuelve `serverDay` (el que calculó el Server Component, así no hay
 * desajuste de hidratación); ya en el navegador mira la hora real y la vuelve a mirar cada minuto.
 * Así «Hoy» no queda atado a la caché ISR de la página (como `LDCTimeSwitch`).
 */
export function useChileWeekday(serverDay: number): number {
  return useSyncExternalStore(subscribe, () => chileWeekdayIndex(), () => serverDay);
}
