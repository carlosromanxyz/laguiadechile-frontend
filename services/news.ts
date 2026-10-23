/**
 * News service — now backed by the NestJS API via the server-only DAL.
 * Data getters are async (fetch the backend). Pure helpers live in
 * `@/lib/format/news` so Client Components can import them safely.
 */
export {
  getNews,
  getNewsBySlug,
  getNewsSlugs,
  getRelatedNews,
} from "@/lib/api/news";

export { isNewArticle, isUpdatedArticle, getReadingTime } from "@/lib/format/news";
