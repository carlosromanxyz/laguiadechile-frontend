/**
 * Pure, client-safe helpers for news. No data fetching / no server-only imports
 * so Client Components (e.g. LDCNewsCard) can import them.
 */

/** True if created within the last 7 days. */
export function isNewArticle(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays <= 7;
}

/** True if updated after creation. */
export function isUpdatedArticle(createdAt: string, updatedAt: string): boolean {
  return createdAt !== updatedAt;
}

/** Estimate reading time in whole minutes (min 1) from HTML content. */
export function getReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
