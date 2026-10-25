import "server-only";

import type { IWikipediaCityInfo, IWikipediaSummary } from "@/interfaces/wikipedia";

/**
 * Resumen de una ciudad desde la Wikipedia en español (REST v1).
 *
 * Solo servidor: lo usa el route handler `/api/wikipedia`, que es lo que pide el cliente
 * (`useCityWikipedia`). Se revalida una vez al día.
 */

const REVALIDATE = 86400; // 1 día

function summaryUrl(title: string): string {
  return `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
}

/**
 * Prueba primero «<ciudad>_(Chile)» para desambiguar y, si no existe, «<ciudad>».
 *
 * @returns El resumen, o `null` si Wikipedia no tiene la página.
 * @throws Si falla la red o la respuesta no es JSON.
 */
export async function getCityWikipedia(city: string): Promise<IWikipediaCityInfo | null> {
  let response = await fetch(`${summaryUrl(city)}_(Chile)`, {
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) {
    response = await fetch(summaryUrl(city), { next: { revalidate: REVALIDATE } });
  }

  if (!response.ok) {
    return null;
  }

  const data: IWikipediaSummary = await response.json();

  return {
    title: data.title,
    extract: data.extract,
    thumbnail: data.thumbnail,
    url: data.content_urls.desktop.page,
    description: data.description,
  };
}
