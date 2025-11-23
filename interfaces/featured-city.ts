export interface IFeaturedCity {
  id: number;
  name: string;
  slug: string;
  image: string;
  count: number;
  featured: boolean;
}

export type IFeaturedCities = IFeaturedCity[];
