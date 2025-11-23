export interface IPost {
  id: number;
  title: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
  image: string;
  createdAt: string;
}

export type IPosts = IPost[];
