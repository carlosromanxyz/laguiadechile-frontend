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

/** «hace 5 min», «hace 2 h», «ayer», «hace 3 días»; más de una semana, «24 ene 2025». */
export function formatRelative(date: Date | string, now = new Date()): string {
  const diffMin = Math.max(0, Math.floor((now.getTime() - new Date(date).getTime()) / 60000));
  if (diffMin < 1) return "recién";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "ayer";
  if (diffD < 7) return `hace ${diffD} días`;
  return formatShortDate(date);
}

/** `YYYY-MM-DD` (día de America/Santiago) → ISO a mediodía UTC, que cae el mismo día en Santiago. */
export function santiagoDayToIso(day: string): string {
  return `${day}T12:00:00.000Z`;
}
