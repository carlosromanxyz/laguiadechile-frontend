export interface IFeaturedCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
  featured: boolean;
  gradient: {
    from: string;
    to: string;
  };
}

export type IFeaturedCategories = IFeaturedCategory[];
