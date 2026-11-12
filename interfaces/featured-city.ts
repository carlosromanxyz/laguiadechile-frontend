export interface IFeaturedCity {
  id: string;
  name: string;
  slug: string;
  /** Foto de la ciudad en el bucket (`/media/cities/...`); sin ella, la tarjeta va sin foto */
  image?: string;
  count: number;
  featured: boolean;
}

export type IFeaturedCities = IFeaturedCity[];
