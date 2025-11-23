export interface ICity {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export type ICities = ICity[];
