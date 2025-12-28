export interface IListingCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface IListingCity {
  id: number;
  name: string;
  slug: string;
}

export interface IListingContact {
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
}

export interface IListingSocialMediaItem {
  url: string;
  followers?: string;
}

export interface IListingSocialMedia {
  facebook?: string | IListingSocialMediaItem;
  instagram?: string | IListingSocialMediaItem;
  twitter?: string | IListingSocialMediaItem;
  youtube?: string | IListingSocialMediaItem;
  tiktok?: string | IListingSocialMediaItem;
}

export interface IListingSchedule {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface IListing {
  id: number;
  title: string;
  slug: string;
  type: "comercio" | "servicio";
  category: IListingCategory;
  city: IListingCity;
  image: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IListingDetail extends IListing {
  description: string;
  address?: string;
  commune?: string;
  contact: IListingContact;
  socialMedia: IListingSocialMedia;
  schedule?: IListingSchedule;
  gallery: string[];
}

export type IListings = IListing[];
export type IListingDetails = IListingDetail[];
