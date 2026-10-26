/**
 * Pure, client-safe helper for cities. No fetching / no server-only.
 */
export function formatPublicationsCount(count: number): string {
  if (count === 0) return "No hay publicaciones";
  if (count === 1) return "Una publicación";
  return `${count.toLocaleString("es-CL")} publicaciones`;
}

/**
 * Conteo simulado y estable a partir del id de la ciudad (mismo id, mismo número).
 */
export function getMockCityCount(cityId: string): number {
  let seed = 23;
  for (const char of cityId) seed = (seed * 17 + char.charCodeAt(0)) % 9973;
  return (seed % 150) + 5;
}

/**
 * URL de imagen de relleno (picsum) para una ciudad, estable por slug e id.
 */
export function getCityImage(citySlug: string, cityId: string): string {
  return `https://picsum.photos/seed/${citySlug}-${cityId}/800/600`;
}
