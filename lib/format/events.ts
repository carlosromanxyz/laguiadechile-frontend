/**
 * Formato de eventos (CLGDC-139/140): fechas siempre en hora de Chile continental
 * (`America/Santiago`, con su horario de verano) y precio en pesos. Helpers puros: sin I/O ni
 * React, seguros en server y client.
 */
import type { IEventPriceType } from "@/interfaces/event";

const TZ = "America/Santiago";

const dayFormat = new Intl.DateTimeFormat("es-CL", {
  timeZone: TZ,
  weekday: "short",
  day: "numeric",
  month: "short",
});
const longDayFormat = new Intl.DateTimeFormat("es-CL", {
  timeZone: TZ,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const hourFormat = new Intl.DateTimeFormat("es-CL", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  // `hour12: false` en es-CL marca la medianoche como «24:00»; `h23` da «00:00».
  hourCycle: "h23",
});
const partsFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Fecha y hora de un instante en Santiago: `{ date: "2026-11-23", time: "16:55" }`. */
export function santiagoParts(iso: string | Date): { date: string; time: string } {
  const parts = partsFormat.formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${hour}:${get("minute")}` };
}

/**
 * Fecha (`YYYY-MM-DD`) y hora (`HH:MM`) escritas en hora de Chile → ISO en UTC. El desfase se
 * calcula para esa fecha (UTC−3 en verano, UTC−4 en invierno); `null` si la fecha o la hora no son
 * válidas.
 */
export function santiagoLocalToIso(date: string, time: string): string | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t) return null;
  const wall = Date.UTC(+d[1], +d[2] - 1, +d[3], +t[1], +t[2]);
  if (Number.isNaN(wall)) return null;
  // Se parte de UTC−4 y se corrige con lo que marca el reloj de Santiago en ese instante.
  let guess = wall + 4 * 3_600_000;
  for (let i = 0; i < 2; i++) {
    const p = santiagoParts(new Date(guess));
    const [y, m, day] = p.date.split("-").map(Number);
    const [h, min] = p.time.split(":").map(Number);
    guess += wall - Date.UTC(y, m - 1, day, h, min);
  }
  return new Date(guess).toISOString();
}

/** «lun 23 nov» */
export function formatEventDay(iso: string): string {
  return dayFormat.format(new Date(iso)).replace(/[,.]/g, "");
}

/** «16:55» */
export function formatEventHour(iso: string): string {
  return hourFormat.format(new Date(iso));
}

/** «lunes, 23 de noviembre de 2026» */
export function formatEventLongDay(iso: string): string {
  return longDayFormat.format(new Date(iso));
}

/**
 * Cuándo es el evento, en una línea: «lun 23 nov · 16:55», «lun 23 nov · 16:55 a 18:55» (mismo
 * día) o «vie 12 dic 20:00 al dom 14 dic 18:00».
 */
export function formatEventWhen(startsAt: string | undefined | null, endsAt?: string | null): string {
  if (!startsAt) return "Fecha por definir";
  if (!endsAt) return `${formatEventDay(startsAt)} · ${formatEventHour(startsAt)}`;
  return santiagoParts(startsAt).date === santiagoParts(endsAt).date
    ? `${formatEventDay(startsAt)} · ${formatEventHour(startsAt)} a ${formatEventHour(endsAt)}`
    : `${formatEventDay(startsAt)} ${formatEventHour(startsAt)} al ${formatEventDay(endsAt)} ${formatEventHour(endsAt)}`;
}

/** Día y mes corto para el bloque de fecha de la tarjeta: `{ day: "23", month: "nov" }`. */
export function eventDateBlock(iso: string): { day: string; month: string } {
  const date = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("es-CL", { timeZone: TZ, day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat("es-CL", { timeZone: TZ, month: "short" }).format(date).replace(".", ""),
  };
}

/** «Gratis», «$12.000» o «Con costo» (pagado sin monto). */
export function formatEventPrice(priceType: IEventPriceType, priceAmount?: number | null): string {
  if (priceType !== "PAID") return "Gratis";
  return priceAmount ? `$${priceAmount.toLocaleString("es-CL")}` : "Con costo";
}

/** Fin efectivo de un evento: su término o, si no tiene, su inicio. */
export function eventEnd(event: { startsAt: string; endsAt?: string | null }): number {
  return new Date(event.endsAt ?? event.startsAt).getTime();
}

/** El evento ya terminó (mismo corte que el backend, `upcomingWhere`). */
export function isPastEvent(event: { startsAt: string; endsAt?: string | null }, now = Date.now()): boolean {
  return eventEnd(event) < now;
}
