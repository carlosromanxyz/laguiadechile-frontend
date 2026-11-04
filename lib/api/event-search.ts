import "server-only";
import { apiGetNoStore, qs } from "./server-fetch";
import { SEARCH_LIMIT, SEARCH_TERM_MAX_LENGTH } from "./listings";

/**
 * Evento tal como lo devuelve `GET /events` (solo los campos que pinta una card).
 *
 * TODO(CLGDC-139): al mergear CLGDC-139, que trae `RawEvent`, `mapEvent` e `IEvent`, cambia este
 * tipo por esos y mueve `searchEvents` a `lib/api/events.ts`. Este archivo queda aparte para no
 * chocar con el `lib/api/events.ts` de ese ticket.
 */
export interface ISearchEvent {
  id: string;
  title: string;
  slug: string;
  startsAt: string;
  endsAt: string | null;
  venueName: string;
  image: string;
  priceType: "FREE" | "PAID";
  priceAmount: number | null;
  featured: boolean;
  city: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string; icon?: string | null } | null;
}

/**
 * Eventos publicados que no terminaron y coinciden con la búsqueda de `/resultados` (CLGDC-189).
 * El backend busca en el título y la descripción sin distinguir tildes ni mayúsculas, filtra por
 * categoría y ciudad (ids) y, sin `includePast`, deja fuera los que ya terminaron. Del más próximo
 * al más lejano. Sin data cache (`apiGetNoStore`): el término es texto libre.
 */
export async function searchEvents(filters: {
  term?: string;
  categoryId?: string;
  cityId?: string;
}): Promise<ISearchEvent[]> {
  return apiGetNoStore<ISearchEvent[]>(
    `/events${qs({
      search: filters.term?.slice(0, SEARCH_TERM_MAX_LENGTH),
      categoryId: filters.categoryId,
      cityId: filters.cityId,
      limit: SEARCH_LIMIT,
    })}`,
  );
}
