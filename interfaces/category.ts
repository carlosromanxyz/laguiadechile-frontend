export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export type ICategories = ICategory[];
