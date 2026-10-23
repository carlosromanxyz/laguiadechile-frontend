export type ClassifiedType = "vendo" | "compro" | "arriendo" | "busco" | "ofrezco";

export type ClassifiedPriceType = "fixed" | "free" | "negotiable" | "contact";

export interface IClassifiedSeller {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export interface IClassified {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ClassifiedType;
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
  commune?: string;
  image: string;
  price: {
    type: ClassifiedPriceType;
    amount?: number;
  };
  featured: boolean;
  createdAt: string;
  expiresAt: string;
  seller: IClassifiedSeller;
  gallery: string[];
}

export type IClassifieds = IClassified[];
