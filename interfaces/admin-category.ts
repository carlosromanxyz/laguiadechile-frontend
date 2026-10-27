/** Categoría tal como la devuelve `/api/categories` al dashboard. */
export interface IAdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Cuerpo para crear o editar una categoría desde el dashboard. */
export interface IAdminCategoryUpsert {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}
