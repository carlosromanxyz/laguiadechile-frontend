"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import { LDCLoadMoreButton } from "@/components/molecules/ldc-load-more-button";
import { IClassifieds } from "@/interfaces/classified";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface LDCPaginatedClassifiedsListProps {
  /** Array of all classifieds */
  classifieds: IClassifieds;
  /** Number of items per page (default: 10) */
  itemsPerPage?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Load more button label */
  loadMoreLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPaginatedClassifiedsList - Paginated List of Classified Cards
 *
 * Client component that displays a paginated list of horizontal classified cards
 * with a "Load More" button. Uses Framer Motion for smooth animations.
 *
 * @example
 * ```tsx
 * <LDCPaginatedClassifiedsList
 *   classifieds={classifieds}
 *   itemsPerPage={10}
 *   loadMoreLabel="Cargar más avisos"
 * />
 * ```
 */
export function LDCPaginatedClassifiedsList({
  classifieds,
  itemsPerPage = 10,
  emptyMessage = "No se encontraron avisos",
  loadMoreLabel = "Cargar más avisos",
  className,
}: LDCPaginatedClassifiedsListProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const visibleClassifieds = classifieds.slice(0, visibleCount);
  const hasMore = visibleCount < classifieds.length;
  const remainingCount = classifieds.length - visibleCount;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + itemsPerPage, classifieds.length));
      setIsLoading(false);
    }, 300);
  }, [itemsPerPage, classifieds.length]);

  if (classifieds.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground max-w-md">
            Intenta ajustar los filtros o vuelve más tarde para ver nuevos avisos.
          </p>
        </div>
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Mostrando {visibleClassifieds.length} de {classifieds.length} avisos
      </p>

      {/* Classifieds list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {visibleClassifieds.map((classified, index) => (
            <motion.div
              key={classified.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index >= visibleCount - itemsPerPage ? (index % itemsPerPage) * 0.05 : 0,
              }}
            >
              <LDCClassifiedCard
                title={classified.title}
                slug={classified.slug}
                type={classified.type}
                category={classified.category}
                city={classified.city}
                commune={classified.commune}
                image={classified.image}
                price={classified.price}
                featured={classified.featured}
                createdAt={classified.createdAt}
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
