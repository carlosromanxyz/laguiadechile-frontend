export interface ICategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export type ICategories = ICategory[];
