"use client";

import { cn } from "@/lib/utils";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCNewsCard } from "@/components/molecules/ldc-news-card";
import { LDCLoadMoreGrid } from "@/components/organisms/ldc-load-more-grid";
import { useLoadMore } from "@/hooks/use-load-more";
import { INewsList } from "@/interfaces/news";

interface LDCPaginatedNewsGridProps {
  /** Array of all news articles */
  articles: INewsList;
  /** Number of items per page (default: 12) */
  itemsPerPage?: number;
  /** Number of columns on large screens (default: 4) */
  columns?: 3 | 4;
  /** Empty state message */
  emptyMessage?: string;
  /** Load more button label */
  loadMoreLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPaginatedNewsGrid - Paginated Grid of News Cards
 *
 * Client component that displays a paginated grid of news cards
 * with a "Load More" button. Uses Framer Motion for smooth animations.
 */
export function LDCPaginatedNewsGrid({
  articles,
  itemsPerPage = 12,
  columns = 4,
  emptyMessage = "No se encontraron noticias",
  loadMoreLabel = "Cargar más noticias",
  className,
}: LDCPaginatedNewsGridProps) {
  const {
    visibleItems: visibleArticles,
    visibleCount,
    hasMore,
    remainingCount,
    isLoading,
    loadMore,
  } = useLoadMore(articles, { pageSize: itemsPerPage });

  const columnClasses = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-2 xl:grid-cols-4",
  };

  if (articles.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <LDCEmptyState
          icon={
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          }
          title={emptyMessage}
          description="Vuelve más tarde para ver nuevas noticias y artículos."
        />
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      <LDCLoadMoreGrid
        gridClassName={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-6 items-start",
          columnClasses[columns]
        )}
        visibleCount={visibleCount}
        pageSize={itemsPerPage}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
        loadMoreLabel={`${loadMoreLabel} (${remainingCount} restantes)`}
      >
        {visibleArticles.map((article) => (
          <LDCNewsCard
            key={article.id}
            id={article.id}
            title={article.title}
            slug={article.slug}
            excerpt={article.excerpt}
            category={article.category}
            author={article.author}
            image={article.image}
            featured={article.featured}
            createdAt={article.createdAt}
            updatedAt={article.updatedAt}
          />
        ))}
      </LDCLoadMoreGrid>
    </LDCSection>
  );
}
