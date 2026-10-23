/**
 * Pure, client-safe helper for cities. No fetching / no server-only.
 */
export function formatPublicationsCount(count: number): string {
  if (count === 0) return "No hay publicaciones";
  if (count === 1) return "Una publicación";
  return `${count.toLocaleString("es-CL")} publicaciones`;
}
