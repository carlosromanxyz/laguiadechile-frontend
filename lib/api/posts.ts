import "server-only";
import type { IPost, IPosts } from "@/interfaces/post";
import { apiGet, apiGetOrNull } from "./server-fetch";
import { mapNews, type RawNews } from "./mappers";

/** Posts are a view over news (home "recent posts"). */
function toPost(n: ReturnType<typeof mapNews>): IPost {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    category: n.category,
    author: n.author,
    image: n.image,
    featured: n.featured,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export async function getRecentPosts(limit = 8): Promise<IPosts> {
  const raw = await apiGet<RawNews[]>(`/news`);
  return raw
    .map(mapNews)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(toPost);
}

export async function getPostBySlug(slug: string): Promise<IPost | undefined> {
  const raw = await apiGetOrNull<RawNews>(`/news/${slug}`);
  return raw ? toPost(mapNews(raw)) : undefined;
}
