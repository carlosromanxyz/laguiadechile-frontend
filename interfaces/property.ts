export type PropertyType =
  | "casa"
  | "departamento"
  | "terreno"
  | "oficina"
  | "local"
  | "bodega";

export type PropertyOperation = "venta" | "arriendo" | "arriendo-temporal";

export type PropertyPriceCurrency = "uf" | "clp";

export interface IPropertyAgent {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  /** Corredora / agency (optional) */
  agency?: string;
}

export interface IProperty {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  operation: PropertyOperation;
  price: {
    amount: number;
    currency: PropertyPriceCurrency;
    /** Monthly common expenses (gastos comunes) for rentals */
    commonExpenses?: number;
    /** Per day/week for temporary rentals */
    period?: "mes" | "dia" | "semana";
  };
  features: {
    /** Surface area in m² */
    surface: number;
    /** Total area in m² (for houses with land) */
    totalSurface?: number;
    /** Number of bedrooms */
    bedrooms: number;
    /** Number of bathrooms */
    bathrooms: number;
    /** Number of parking spots */
    parking: number;
  };
  location: {
    city: {
      name: string;
      slug: string;
    };
    commune: string;
    neighborhood?: string;
  };
  image: string;
  images?: string[];
  featured: boolean;
  isNew: boolean;
  createdAt: string;
  agent: IPropertyAgent;
}

export type IProperties = IProperty[];
