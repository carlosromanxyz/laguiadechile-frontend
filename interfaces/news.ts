export interface INews {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Full article body (HTML) */
  content: string;
  category: {
    id: string;
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
