/**
 * Fechas del panel, siempre en America/Santiago (el servidor corre en UTC).
 * Helpers puros: sin I/O ni React.
 */

const TZ = "America/Santiago";

/** «14 oct» */
export function formatDayMonth(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short", timeZone: TZ })
    .format(new Date(date))
    .replace(".", "");
}

/** «24 ene 2025» */
export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  })
    .format(new Date(date))
    .replace(".", "");
}

const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type WeekdayKey = (typeof WEEKDAY_KEYS)[number];

/** Día de la semana de hoy en Santiago: clave del horario (`tuesday`) y nombre («martes»). */
export function getTodayInSantiago(now = new Date()): { key: WeekdayKey; name: string } {
  const name = new Intl.DateTimeFormat("es-CL", { weekday: "long", timeZone: TZ }).format(now);
  const short = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TZ }).format(now);
  const index = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(short);
  return { key: WEEKDAY_KEYS[Math.max(index, 0)], name };
}

/** Las últimas `days` fechas (ISO), de la más antigua a hoy. */
export function lastDays(days: number, now = new Date()): string[] {
  const dayMs = 24 * 60 * 60 * 1000;
  return Array.from({ length: days }, (_, i) =>
    new Date(now.getTime() - (days - 1 - i) * dayMs).toISOString(),
  );
}
