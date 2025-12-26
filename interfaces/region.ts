export interface IRegionCity {
  id: number;
  name: string;
  slug: string;
  isCapital: boolean;
}

export interface IRegion {
  id: number;
  name: string;
  romanNumeral: string;
  slug: string;
  cities: IRegionCity[];
}

export type IRegions = IRegion[];
