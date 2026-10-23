/**
 * Search data (categories + cities) — backed by the NestJS API via the DAL.
 * The hero (Client Component) fetches these through the `/api/categories` and
 * `/api/cities` Route Handlers; this server shim remains for any server usage.
 */
export { getCategories, getCities } from "@/lib/api/catalog";
