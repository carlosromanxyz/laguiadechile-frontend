import "server-only";
import type { IPlace, IPlaces, IPlaceType } from "@/interfaces/place";
import { PLACE_TYPES } from "@/lib/format/places";
import { apiGetNoStoreOrNull, apiGetOrNull, qs } from "./server-fetch";
import { SEARCH_LIMIT, SEARCH_TERM_MAX_LENGTH } from "./listings";
import { mapPlace, type RawPlace } from "./mappers";

/** Tope de `GET /places` (`limit` ≤ 200 en el backend). */
const PLACES_LIMIT = 200;

/**
 * Todos los lugares (destacados primero y luego por título, como los ordena el backend), con ISR.
 * Si la API todavía no expone `/places` (404), lista vacía: las páginas responden sin romper.
 */
async function fetchAll(): Promise<IPlaces> {
  const raw = await apiGetOrNull<RawPlace[]>(`/places${qs({ limit: PLACES_LIMIT })}`);
  return (raw ?? []).map(mapPlace);
}

export interface IPlaceFilters {
  /** Tipo (`?tipo=`); vacío, todos */
  type?: IPlaceType;
  /** Slug de la ciudad (`?ciudad=`); vacío, todas */
  city?: string;
}

export interface IPlacesPage {
  places: IPlaces;
  /** Cuántos hay de cada tipo (y en total, `ALL`) con la ciudad elegida */
  counts: Record<IPlaceType | "ALL", number>;
  /** Ciudades que tienen lugares (opciones del filtro), por nombre */
  cities: { id: string; name: string; slug: string }[];
}

/** Listado público de `/lugares` (CLGDC-207), filtrado por tipo y ciudad. */
export async function getPlacesPage(filters: IPlaceFilters = {}): Promise<IPlacesPage> {
  const all = await fetchAll();
  const inCity = all.filter((p) => !filters.city || p.city.slug === filters.city);
  const places = inCity.filter((p) => !filters.type || p.type === filters.type);

  const counts = { ALL: inCity.length } as IPlacesPage["counts"];
  for (const t of PLACE_TYPES) counts[t] = inCity.filter((p) => p.type === t).length;

  const cities = new Map<string, IPlacesPage["cities"][number]>();
  for (const p of all) cities.set(p.city.slug, p.city);

  return {
    places,
    counts,
    cities: [...cities.values()].sort((a, b) => a.name.localeCompare(b.name, "es")),
  };
}

/** Detalle público por slug; `undefined` si no existe (la API responde 404). */
export async function getPlaceBySlug(slug: string): Promise<IPlace | undefined> {
  const raw = await apiGetOrNull<RawPlace>(`/places/${encodeURIComponent(slug)}`);
  return raw ? mapPlace(raw) : undefined;
}

/** Slugs de todos los lugares (para `generateStaticParams`). */
export async function getPlaceSlugs(): Promise<{ slug: string }[]> {
  return (await fetchAll()).map((p) => ({ slug: p.slug }));
}

/** Lugares de una ciudad (bloque «Lugares de {ciudad}» de `/ciudad/[slug]`). */
export async function getPlacesByCity(citySlug: string): Promise<IPlaces> {
  return (await fetchAll()).filter((p) => p.city.slug === citySlug);
}

/**
 * Lugares que coinciden con la búsqueda de `/resultados`. El backend busca en el título y la
 * descripción sin distinguir tildes ni mayúsculas y filtra por ciudad (id). Los lugares no tienen
 * categoría. Sin data cache: el término es texto libre. Sin `/places` en la API (404), vacío.
 */
export async function searchPlaces(filters: { term?: string; cityId?: string }): Promise<IPlaces> {
  const raw = await apiGetNoStoreOrNull<RawPlace[]>(
    `/places${qs({
      search: filters.term?.slice(0, SEARCH_TERM_MAX_LENGTH),
      cityId: filters.cityId,
      limit: SEARCH_LIMIT,
    })}`,
  );
  return (raw ?? []).map(mapPlace);
}
