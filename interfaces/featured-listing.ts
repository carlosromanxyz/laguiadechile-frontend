export interface IFeaturedListing {
  id: string;
  title: string;
  slug: string;
  type: "comercio" | "servicio";
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  city: {
    id: string;
    name: string;
    slug: string;
  };
  image: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IFeaturedListings = IFeaturedListing[];
