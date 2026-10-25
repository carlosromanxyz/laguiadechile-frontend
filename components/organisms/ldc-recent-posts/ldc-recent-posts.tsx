import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCNewsCard } from "@/components/molecules/ldc-news-card";
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
export async function LDCRecentPosts() {
  const posts = await getRecentPosts(10);

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
