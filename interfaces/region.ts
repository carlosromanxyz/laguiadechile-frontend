export interface IRegionCity {
  id: string;
  name: string;
  slug: string;
  isCapital: boolean;
}

export interface IRegion {
  id: string;
  name: string;
  romanNumeral: string;
  slug: string;
  cities: IRegionCity[];
}

export type IRegions = IRegion[];
