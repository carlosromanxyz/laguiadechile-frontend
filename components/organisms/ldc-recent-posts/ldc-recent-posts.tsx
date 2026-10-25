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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {posts.map((post) => (
          <LDCNewsCard
            key={post.id}
            variant="post"
            title={post.title}
            slug={post.slug}
            category={post.category}
            image={post.image}
          />
        ))}
      </div>
    </LDCSection>
  );
}
