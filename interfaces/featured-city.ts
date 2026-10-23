export interface IFeaturedCity {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
  featured: boolean;
}

export type IFeaturedCities = IFeaturedCity[];
