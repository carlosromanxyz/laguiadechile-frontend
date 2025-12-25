"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCNewsCard } from "@/components/molecules/ldc-news-card";
import { LDCLoadMoreButton } from "@/components/molecules/ldc-load-more-button";
import { INewsList } from "@/interfaces/news";
import { motion, AnimatePresence } from "framer-motion";

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
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;
  const remainingCount = articles.length - visibleCount;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + itemsPerPage, articles.length));
      setIsLoading(false);
    }, 300);
  }, [itemsPerPage, articles.length]);

  const columnClasses = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-2 xl:grid-cols-4",
  };

  if (articles.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
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
          </div>
          <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground max-w-md">
            Vuelve más tarde para ver nuevas noticias y artículos.
          </p>
        </div>
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-6 items-start",
          columnClasses[columns]
        )}
      >
        <AnimatePresence mode="popLayout">
          {visibleArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay:
                  index >= visibleCount - itemsPerPage
                    ? (index % itemsPerPage) * 0.05
                    : 0,
              }}
            >
              <LDCNewsCard
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <LDCLoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoading}
          label={`${loadMoreLabel} (${remainingCount} restantes)`}
          loadingLabel="Cargando..."
        />
      )}
    </LDCSection>
  );
}
