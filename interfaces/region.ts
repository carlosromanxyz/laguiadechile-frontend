export interface IRegionCity {
  id: string;
  name: string;
  slug: string;
  isCapital: boolean;
  /** Foto de la ciudad en el bucket (`/media/cities/<slug>-<hash8>.<ext>`), si la tiene */
  image?: string;
}

export interface IRegion {
  id: string;
  name: string;
  romanNumeral: string;
  slug: string;
  cities: IRegionCity[];
}

export type IRegions = IRegion[];
