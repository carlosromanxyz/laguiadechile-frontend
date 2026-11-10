/**
 * Lugares (CLGDC-207): textos del tipo, resumen del horario y lo que pasa hoy. Helpers puros (sin
 * I/O ni React), seguros en server y client.
 *
 * El horario tiene el formato de `Listing.schedule` (`{ monday: "08:00 - 14:00", …, sunday:
 * "Cerrado" }`); un día sin clave o «Cerrado» está cerrado, y «24 horas» o «Todo el día» se leen
 * como texto.
 */
import type { IListingSchedule } from "@/interfaces/listing";
import type { IPlaceType } from "@/interfaces/place";

/** Tipos en el orden en que se muestran (atractivos, servicios públicos, ferias). */
export const PLACE_TYPES: readonly IPlaceType[] = ["ATTRACTION", "PUBLIC_SERVICE", "MARKET"];

export interface IPlaceTypeMeta {
  /** Singular del distintivo: «Atractivo» */
  label: string;
  /** Plural de los encabezados y filtros: «Atractivos» */
  plural: string;
  /** Valor de `?tipo=` en `/lugares` */
  query: string;
}

export const PLACE_TYPE_META: Record<IPlaceType, IPlaceTypeMeta> = {
  ATTRACTION: { label: "Atractivo", plural: "Atractivos", query: "atractivos" },
  PUBLIC_SERVICE: { label: "Servicio público", plural: "Servicios públicos", query: "servicios" },
  MARKET: { label: "Feria o mercado", plural: "Ferias y mercados", query: "ferias" },
};

/** `?tipo=atractivos` → `ATTRACTION`; otro valor, `undefined` (todos). */
export function placeTypeFromQuery(value: string): IPlaceType | undefined {
  return PLACE_TYPES.find((t) => PLACE_TYPE_META[t].query === value);
}

/** Días de lunes a domingo (claves del horario). */
export const PLACE_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const DAY_LONG = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const DAY_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
/** Iniciales de `LDCWeekDays`. */
export const DAY_INITIALS = ["L", "M", "M", "J", "V", "S", "D"];

const ALWAYS = "24 horas";
const ALL_DAY = "todo el día";

/** Día de la semana en Chile (0 = lunes … 6 = domingo). */
export function chileWeekdayIndex(date: Date = new Date()): number {
  const name = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/Santiago" }).format(date);
  const i = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(name);
  return i < 0 ? 0 : i;
}

/** Nombre del día («Martes»). */
export function dayName(index: number): string {
  return DAY_LONG[index] ?? "";
}

/** El texto de un día es de apertura (no vacío ni «Cerrado»). */
export function isOpenDay(value: string | undefined): value is string {
  return Boolean(value && value.trim() && value.trim().toLowerCase() !== "cerrado");
}

/** Texto de un día (vacío si el horario no lo trae). */
export function dayHours(schedule: IListingSchedule | undefined, index: number): string | undefined {
  return schedule?.[PLACE_DAYS[index]]?.trim() || undefined;
}

/** El horario tiene al menos un día abierto. */
export function hasOpenDays(schedule: IListingSchedule | undefined): boolean {
  return PLACE_DAYS.some((d) => isOpenDay(schedule?.[d]));
}

/**
 * Resumen del horario: «Lunes a viernes, 08:00 - 14:00», «Martes y viernes, 08:00 - 14:00»,
 * «Abierto las 24 horas», «Siempre abierto». Con `short`, días abreviados y separados con «·».
 */
export function formatScheduleSummary(schedule: IListingSchedule | undefined, short = false): string {
  const names = short ? DAY_SHORT : DAY_LONG;
  const groups = new Map<string, number[]>();
  PLACE_DAYS.forEach((d, i) => {
    const v = schedule?.[d]?.trim();
    if (isOpenDay(v)) groups.set(v, [...(groups.get(v) ?? []), i]);
  });
  if (groups.size === 0) return "Sin horario publicado";
  if (groups.size === 1) {
    const [[hours, days]] = [...groups.entries()];
    if (days.length === 7) {
      if (hours.toLowerCase() === ALWAYS) return "Abierto las 24 horas";
      if (hours.toLowerCase() === ALL_DAY) return "Siempre abierto";
      return `Todos los días${short ? " · " : ", "}${hours}`;
    }
  }
  return [...groups.entries()]
    .map(([hours, days]) => {
      const contiguous = days.every((v, j) => j === 0 || v === days[j - 1] + 1);
      const label =
        contiguous && days.length >= 3
          ? `${names[days[0]]} a ${names[days[days.length - 1]].toLowerCase()}`
          : days
              .map((v, j) => (j ? names[v].toLowerCase() : names[v]))
              .join(", ")
              .replace(/, ([^,]*)$/, " y $1");
      return `${label}${short ? " · " : ", "}${hours}`;
    })
    .join(short ? " · " : "; ");
}

/** Abre todos los días con el mismo texto continuo («24 horas» o «Todo el día»). */
function alwaysOpenSummary(schedule: IListingSchedule | undefined): string | undefined {
  const s = formatScheduleSummary(schedule, true);
  return s === "Abierto las 24 horas" || s === "Siempre abierto" ? s : undefined;
}

/** Próximo día abierto después de hoy: «Próxima: mañana, 08:00 - 14:00». */
function nextOpenText(schedule: IListingSchedule | undefined, today: number): string | undefined {
  for (let k = 1; k < 8; k++) {
    const i = (today + k) % 7;
    const hours = dayHours(schedule, i);
    if (isOpenDay(hours)) return `Próxima: ${k === 1 ? "mañana" : DAY_LONG[i].toLowerCase()}, ${hours}`;
  }
  return undefined;
}

/** Lo de hoy en una línea: un tramo destacado y, si hay, el resto. */
export interface IPlaceTodayText {
  strong: string;
  rest?: string;
}

/**
 * Qué pasa hoy en un lugar, según dónde se muestra:
 * - `line` (tarjeta y fila): «Hoy 10:00 - 18:00 · Mar a dom · 10:00 - 18:00», «Cerrado hoy · …» o
 *   «Abierto las 24 horas». En una feria: «Hoy hay feria · 07:00 - 16:00» o «Próxima: viernes, …».
 * - `fact` (dato rápido de la ficha): «Abierto las 24 horas», «10:00 - 18:00», «Hay feria · …» o
 *   «Cerrado hoy».
 */
export function placeTodayText(
  schedule: IListingSchedule | undefined,
  type: IPlaceType,
  today: number,
  mode: "line" | "fact",
): IPlaceTodayText {
  if (!hasOpenDays(schedule)) return { strong: "Sin horario publicado" };
  const hours = dayHours(schedule, today);
  const open = isOpenDay(hours);
  if (type === "MARKET") {
    if (open) return { strong: `${mode === "line" ? "Hoy hay" : "Hay"} feria · ${hours}` };
    return mode === "line"
      ? { strong: nextOpenText(schedule, today) ?? "Sin feria esta semana" }
      : { strong: "No hay feria hoy", rest: nextOpenText(schedule, today)?.replace("Próxima:", "próxima:") };
  }
  const always = alwaysOpenSummary(schedule);
  if (always) return { strong: always };
  if (mode === "fact") {
    if (!open) return { strong: "Cerrado hoy" };
    const lower = hours.toLowerCase();
    return { strong: lower === ALWAYS ? "Abierto las 24 horas" : lower === ALL_DAY ? "Abierto todo el día" : hours };
  }
  const summary = formatScheduleSummary(schedule, true);
  // Mismo horario los siete días: no se repiten las horas («Hoy 08:00 - 20:00 · Todos los días»).
  const rest = summary.startsWith("Todos los días") ? "Todos los días" : summary;
  return { strong: open ? `Hoy ${hours}` : "Cerrado hoy", rest };
}

/**
 * `tel:` seguro para un teléfono: solo dígitos y un `+` inicial (lgdc-security). `undefined` si no
 * quedan dígitos.
 */
export function telHref(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return undefined;
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}

/** Números nacionales de emergencia, gratis y las 24 horas. */
export const EMERGENCY_NUMBERS = [
  { number: "131", label: "SAMU", detail: "Ambulancia" },
  { number: "132", label: "Bomberos", detail: "Incendios y rescate" },
  { number: "133", label: "Carabineros", detail: "Policía" },
] as const;

/** Nombre del servicio de un número corto conocido («SAMU» para 131); si no, «Emergencias». */
export function emergencyLabel(number: string): string {
  return EMERGENCY_NUMBERS.find((n) => n.number === number)?.label ?? "Emergencias";
}

/** Enlace de Google Maps con la ruta hasta la dirección. */
export function directionsHref(address: string, city: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, ${city}, Chile`)}`;
}
