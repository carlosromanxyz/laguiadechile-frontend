/**
 * Horario semanal de una ficha. En la base es un JSON `{ monday: "09:00 - 21:00", … }`; en el
 * formulario, un día abierto o cerrado con hora de apertura y de cierre.
 *
 * Un día cerrado se guarda como `"Cerrado"` (la ficha pública lo pinta en rojo). Un texto que no
 * es un rango de horas (p. ej. `"24 horas"`) se conserva tal cual mientras no se edite.
 * Helpers puros: sin I/O ni React.
 */
import type { IListingSchedule } from "@/interfaces/listing";

export type LDCScheduleDayKey = keyof IListingSchedule;

/** Días en orden de lunes a domingo, con su nombre visible. */
export const SCHEDULE_DAYS: ReadonlyArray<readonly [LDCScheduleDayKey, string]> = [
  ["monday", "Lunes"],
  ["tuesday", "Martes"],
  ["wednesday", "Miércoles"],
  ["thursday", "Jueves"],
  ["friday", "Viernes"],
  ["saturday", "Sábado"],
  ["sunday", "Domingo"],
];

export const SCHEDULE_CLOSED = "Cerrado";

export interface IScheduleDayValue {
  open: boolean;
  /** `HH:MM` */
  from: string;
  /** `HH:MM` */
  to: string;
  /** Texto original que no es un rango (p. ej. «24 horas»); se guarda tal cual si no se edita */
  label?: string;
}

export type IScheduleValue = Record<LDCScheduleDayKey, IScheduleDayValue>;

const RANGE = /^\s*(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})\s*$/;
const pad = (n: string) => n.padStart(2, "0");

const DEFAULT_FROM = "09:00";
const DEFAULT_TO = "18:00";

function parseDay(raw: unknown): IScheduleDayValue {
  if (typeof raw !== "string" || !raw.trim() || raw.trim().toLowerCase() === "cerrado") {
    return { open: false, from: DEFAULT_FROM, to: DEFAULT_TO };
  }
  const m = RANGE.exec(raw);
  if (!m) return { open: true, from: DEFAULT_FROM, to: DEFAULT_TO, label: raw.trim() };
  return { open: true, from: `${pad(m[1])}:${m[2]}`, to: `${pad(m[3])}:${m[4]}` };
}

/** JSON de la base → valor del formulario (un día sin clave queda cerrado). */
export function scheduleFromApi(schedule: unknown): IScheduleValue {
  const src = schedule && typeof schedule === "object" ? (schedule as Record<string, unknown>) : {};
  return Object.fromEntries(SCHEDULE_DAYS.map(([key]) => [key, parseDay(src[key])])) as IScheduleValue;
}

/** Valor del formulario → JSON para el backend. Si todos los días están cerrados, `null` (sin horario). */
export function scheduleToApi(value: IScheduleValue): IListingSchedule | null {
  if (SCHEDULE_DAYS.every(([key]) => !value[key].open)) return null;
  const out: IListingSchedule = {};
  for (const [key] of SCHEDULE_DAYS) {
    const day = value[key];
    out[key] = !day.open ? SCHEDULE_CLOSED : (day.label ?? `${day.from} - ${day.to}`);
  }
  return out;
}
