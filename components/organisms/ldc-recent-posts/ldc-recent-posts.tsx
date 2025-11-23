import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCPostCard } from "@/components/molecules/ldc-post-card";
import { getRecentPosts } from "@/services/posts";

/**
 * LDCRecentPosts - Recent Posts/News Section
 *
 * Displays a grid of recent news articles and posts.
 * Server Component that fetches recent posts sorted by creation date.
 *
 * @example
 * ```tsx
 * <LDCRecentPosts />
 * ```
 */
export function LDCRecentPosts() {
  const posts = getRecentPosts(8);

  return (
    <LDCSection>
      <LDCSectionHeader
        title="Noticias recientes"
        subtitle="Explora el acontecer nacional e internacional"
      />

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <LDCPostCard
            key={post.id}
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
