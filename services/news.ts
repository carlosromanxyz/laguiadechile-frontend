import newsData from "@/data/news.json";
import { INews, INewsList } from "@/interfaces/news";

/**
 * Check if a news article is new (created within the last 7 days)
 */
export function isNewArticle(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays <= 7;
}

/**
 * Check if a news article was updated after creation
 */
export function isUpdatedArticle(createdAt: string, updatedAt: string): boolean {
  return createdAt !== updatedAt;
}

/**
 * Get all news articles sorted by creation date (most recent first)
 * @returns Array of all news articles
 */
export function getNews(): INewsList {
  return [...newsData].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) as INewsList;
}

/**
 * Get featured news articles
 * @param limit - Number of articles to return (default: 5)
 * @returns Array of featured news articles
 */
export function getFeaturedNews(limit: number = 5): INewsList {
  return getNews()
    .filter((article) => article.featured)
    .slice(0, limit) as INewsList;
}

/**
 * Get recent news articles
 * @param limit - Number of articles to return (default: 8)
 * @returns Array of recent news articles
 */
export function getRecentNews(limit: number = 8): INewsList {
  return getNews().slice(0, limit) as INewsList;
}

/**
 * Get news article by slug
 * @param slug - Article slug
 * @returns News article or undefined
 */
export function getNewsBySlug(slug: string): INews | undefined {
  return newsData.find((article) => article.slug === slug) as INews | undefined;
}

/**
 * Get news articles by category
 * @param categorySlug - Category slug
 * @returns Array of news articles in the category
 */
export function getNewsByCategory(categorySlug: string): INewsList {
  return getNews().filter(
    (article) => article.category.slug === categorySlug
  ) as INewsList;
}
