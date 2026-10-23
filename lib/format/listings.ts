/**
 * Pure, client-safe helpers for listings. No fetching / no server-only.
 */

/** True if created within the last 7 days. */
export function isNewListing(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffInDays <= 7;
}

/** True if updated within the last 7 days and different from creation. */
export function isUpdatedListing(createdAt: string, updatedAt: string): boolean {
  if (createdAt === updatedAt) return false;
  const updated = new Date(updatedAt);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffInDays <= 7;
}
