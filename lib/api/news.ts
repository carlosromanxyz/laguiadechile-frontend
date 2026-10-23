import "server-only";
import type { INews, INewsList } from "@/interfaces/news";
import { apiGet, apiGetOrNull, qs } from "./server-fetch";
import { mapNews, type RawNews } from "./mappers";

/** All news (backend already orders featured desc, publishedAt desc). */
export async function getNews(limit?: number): Promise<INewsList> {
  const raw = await apiGet<RawNews[]>(`/news${qs({ limit })}`);
  return raw.map(mapNews);
}

export async function getNewsBySlug(slug: string): Promise<INews | null> {
  const raw = await apiGetOrNull<RawNews>(`/news/${slug}`);
  return raw ? mapNews(raw) : null;
}

export async function getNewsSlugs(): Promise<{ slug: string }[]> {
  const raw = await apiGet<RawNews[]>(`/news`);
  return raw.map((n) => ({ slug: n.slug }));
}

/** Same category, excluding current; padded with recent ones. */
export async function getRelatedNews(
  currentId: string,
  categorySlug: string,
  limit = 3,
): Promise<INewsList> {
  const all = (await getNews()).filter((n) => n.id !== currentId);
  const same = all.filter((n) => n.category.slug === categorySlug);
  const result = [...same];
  for (const n of all) {
    if (result.length >= limit) break;
    if (!result.some((r) => r.id === n.id)) result.push(n);
  }
  return result.slice(0, limit);
}
