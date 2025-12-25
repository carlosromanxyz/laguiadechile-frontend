export interface INews {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type INewsList = INews[];
