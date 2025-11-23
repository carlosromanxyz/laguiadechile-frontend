export interface IFeaturedListing {
  id: number;
  title: string;
  slug: string;
  type: "comercio" | "servicio";
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
  city: {
    id: number;
    name: string;
    slug: string;
  };
  image: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IFeaturedListings = IFeaturedListing[];
