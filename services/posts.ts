import recentPostsData from "@/data/recent-posts.json";
import { IPost, IPosts } from "@/interfaces/post";

/**
 * Get recent posts sorted by creation date (most recent first)
 * @param limit - Number of posts to return (default: 8)
 * @returns Array of recent posts
 */
export function getRecentPosts(limit: number = 8): IPosts {
  return [...recentPostsData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit) as IPosts;
}

/**
 * Get post by slug
 * @param slug - Post slug
 * @returns Post object or undefined
 */
export function getPostBySlug(slug: string): IPost | undefined {
  return recentPostsData.find((post) => post.slug === slug) as IPost | undefined;
}
