import "server-only";
import type { IEvent, IEventWhen, IEvents } from "@/interfaces/event";
import { isPastEvent } from "@/lib/format/events";
import { apiGet, apiGetOrNull, qs } from "./server-fetch";
import { mapEvent, type RawEvent } from "./mappers";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Tope de `GET /events` (`limit` ≤ 200 en el backend). */
const EVENTS_LIMIT = 200;

/**
 * Todos los eventos publicados, también los que ya terminaron (`includePast=true`), del más
 * próximo al más lejano. Con ISR: los filtros del listado se aplican aquí sobre esta lista.
 */
async function fetchAll(): Promise<IEvents> {
  const raw = await apiGet<RawEvent[]>(`/events${qs({ includePast: "true", limit: EVENTS_LIMIT })}`);
  return raw.map(mapEvent);
}

export interface IEventFilters {
  /** Slug de la ciudad (`?ciudad=`); vacío, todas */
  city?: string;
  /** Slug de la categoría (`?categoria=`); vacío, todas */
  category?: string;
  /** `?cuando=`; por defecto, los próximos */
  when?: IEventWhen;
}

/** ¿El evento entra en la ventana «Cuándo»? Próximos incluye los que están en curso. */
function matchesWhen(event: IEvent, when: IEventWhen, now: number): boolean {
  if (when === "pasados") return isPastEvent(event, now);
  if (isPastEvent(event, now)) return false;
  const start = new Date(event.startsAt).getTime();
  if (when === "semana") return start <= now + 7 * DAY_MS;
  if (when === "mes") return start <= now + 30 * DAY_MS;
  return true;
}

export interface IEventsPage {
  events: IEvents;
  /** Instante (ms) con que se calcularon los cortes (para marcar los terminados en la grilla) */
  now: number;
  /** Cuántos hay en cada ventana «Cuándo», con los filtros de ciudad y categoría */
  counts: Record<IEventWhen, number>;
  /** Ciudades y categorías que tienen eventos publicados (opciones de los filtros) */
  cities: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string; icon?: string }[];
}

/**
 * Listado público de `/eventos` (CLGDC-139): por defecto los próximos (en curso o por venir), del
 * más próximo al más lejano; con `pasados`, los terminados, del más reciente al más antiguo.
 */
export async function getEventsPage(filters: IEventFilters = {}, now = Date.now()): Promise<IEventsPage> {
  const all = await fetchAll();
  const when = filters.when ?? "proximos";
  const byPlace = all.filter(
    (e) =>
      (!filters.city || e.city.slug === filters.city) &&
      (!filters.category || e.category?.slug === filters.category),
  );
  const events = byPlace.filter((e) => matchesWhen(e, when, now));
  if (when === "pasados") events.reverse();

  const counts = {
    proximos: byPlace.filter((e) => matchesWhen(e, "proximos", now)).length,
    semana: byPlace.filter((e) => matchesWhen(e, "semana", now)).length,
    mes: byPlace.filter((e) => matchesWhen(e, "mes", now)).length,
    pasados: byPlace.filter((e) => matchesWhen(e, "pasados", now)).length,
  };

  const cities = new Map<string, IEventsPage["cities"][number]>();
  const categories = new Map<string, IEventsPage["categories"][number]>();
  for (const e of all) {
    cities.set(e.city.slug, e.city);
    if (e.category) categories.set(e.category.slug, e.category);
  }
  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "es");

  return {
    events,
    now,
    counts,
    cities: [...cities.values()].sort(byName),
    categories: [...categories.values()].sort(byName),
  };
}

/** Próximos eventos publicados (en curso o por venir). */
export async function getUpcomingEvents(limit?: number): Promise<IEvents> {
  const now = Date.now();
  const upcoming = (await fetchAll()).filter((e) => !isPastEvent(e, now));
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/** Detalle público: solo PUBLISHED (también si ya pasó). `undefined` si no existe o no se publica. */
export async function getEventBySlug(slug: string): Promise<IEvent | undefined> {
  const raw = await apiGetOrNull<RawEvent>(`/events/${encodeURIComponent(slug)}`);
  return raw ? mapEvent(raw) : undefined;
}

/** Slugs de los eventos publicados (para `generateStaticParams`). */
export async function getEventSlugs(): Promise<{ slug: string }[]> {
  return (await fetchAll()).map((e) => ({ slug: e.slug }));
}

/** Próximos eventos de la misma categoría o ciudad, sin el actual. */
export async function getRelatedEvents(event: IEvent, limit = 4): Promise<IEvents> {
  return (await getUpcomingEvents())
    .filter(
      (e) =>
        e.id !== event.id &&
        ((event.category && e.category?.id === event.category.id) || e.city.id === event.city.id),
    )
    .slice(0, limit);
}
