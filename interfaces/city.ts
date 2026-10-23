export interface ICity {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export type ICities = ICity[];
