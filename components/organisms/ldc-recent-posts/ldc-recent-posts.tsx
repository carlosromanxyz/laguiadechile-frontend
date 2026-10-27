import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCNewsCard } from "@/components/molecules/ldc-news-card";
import type { IPosts } from "@/interfaces/post";

interface LDCRecentPostsProps {
  posts: IPosts;
}

/**
 * LDCRecentPosts - Recent Posts/News Section
 *
 * Displays a grid of recent news articles and posts.
 * Server Component: recibe los datos por props (los carga la home).
 *
 * @example
 * ```tsx
 * <LDCRecentPosts posts={posts} />
 * ```
 */
export function LDCRecentPosts({ posts }: LDCRecentPostsProps) {
  return (
    <LDCSection>
      <LDCSectionHeader
        title="Noticias recientes"
        subtitle="Explora el acontecer nacional e internacional"
      />

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start lg:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <LDCNewsCard
            key={post.id}
            id={post.id}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            category={post.category}
            author={post.author}
            image={post.image}
            featured={post.featured}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
          />
        ))}
      </div>
    </LDCSection>
  );
}
