export type ClassifiedType = "vendo" | "compro" | "arriendo" | "busco" | "ofrezco";

export type ClassifiedPriceType = "fixed" | "free" | "negotiable" | "contact";

export interface IClassified {
  id: number;
  title: string;
  slug: string;
  description: string;
  type: ClassifiedType;
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
  commune?: string;
  image: string;
  price: {
    type: ClassifiedPriceType;
    amount?: number;
  };
  featured: boolean;
  createdAt: string;
  expiresAt: string;
}

export type IClassifieds = IClassified[];
