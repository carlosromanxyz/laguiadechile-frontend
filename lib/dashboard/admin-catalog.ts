import { parseAdminListParams, type IAdminListSearchParams } from "@/lib/dashboard/admin-publication-status";

/** Tamaño de página de los listados del catálogo admin (el mismo de `ADMIN_PAGE_SIZE`). */
export const CATALOG_PAGE_SIZE = 20;

/** Texto sin tildes ni mayúsculas, para buscar «valparaiso» en «Valparaíso». */
export function normalizeSearch(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

/** Filtros de la URL de un listado del catálogo: búsqueda (`?q=`), ciudad (`?ciudad=`) y página. */
export function parseCatalogParams(params: IAdminListSearchParams) {
  const { q, city, page } = parseAdminListParams(params);
  return { q, city, page };
}

/**
 * Página de un listado que la API devuelve entero (regiones, ciudades, noticias, propiedades: sin
 * paginación en el backend). Una página fuera de rango cae en la última.
 */
export function paginateCatalog<T>(rows: readonly T[], page: number, pageSize = CATALOG_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(Math.max(page, 1), pageCount);
  return {
    items: rows.slice((current - 1) * pageSize, current * pageSize),
    total: rows.length,
    page: current,
  };
}
