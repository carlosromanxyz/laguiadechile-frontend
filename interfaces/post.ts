export interface IPost {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  image: string;
  createdAt: string;
}

export type IPosts = IPost[];
