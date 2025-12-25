"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCPropertyCard } from "@/components/molecules/ldc-property-card";
import { LDCLoadMoreButton } from "@/components/molecules/ldc-load-more-button";
import { IProperties } from "@/interfaces/property";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";

interface LDCPaginatedPropertiesGridProps {
  /** Array of all properties */
  properties: IProperties;
  /** Number of items per page (default: 9 for 3-column grid) */
  itemsPerPage?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Load more button label */
  loadMoreLabel?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPaginatedPropertiesGrid - Paginated Grid of Property Cards
 *
 * Client component that displays a paginated 3-column grid of property cards
 * with a "Load More" button. Uses Framer Motion for smooth animations.
 *
 * @example
 * ```tsx
 * <LDCPaginatedPropertiesGrid
 *   properties={properties}
 *   itemsPerPage={9}
 *   loadMoreLabel="Cargar más propiedades"
 * />
 * ```
 */
export function LDCPaginatedPropertiesGrid({
  properties,
  itemsPerPage = 9,
  emptyMessage = "No se encontraron propiedades",
  loadMoreLabel = "Cargar más propiedades",
  className,
}: LDCPaginatedPropertiesGridProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const visibleProperties = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;
  const remainingCount = properties.length - visibleCount;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + itemsPerPage, properties.length));
      setIsLoading(false);
    }, 300);
  }, [itemsPerPage, properties.length]);

  if (properties.length === 0) {
    return (
      <LDCSection paddingY="lg">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
            <Home className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground max-w-md">
            Intenta ajustar los filtros o vuelve más tarde para ver nuevas propiedades.
          </p>
        </div>
      </LDCSection>
    );
  }

  return (
    <LDCSection paddingY="lg" className={className}>
      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Mostrando {visibleProperties.length} de {properties.length} propiedades
      </p>

      {/* Properties grid - 5 columns on xl, items aligned at top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
        <AnimatePresence mode="popLayout">
          {visibleProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index >= visibleCount - itemsPerPage ? (index % itemsPerPage) * 0.05 : 0,
              }}
            >
              <LDCPropertyCard
                title={property.title}
                slug={property.slug}
                type={property.type}
                operation={property.operation}
                price={property.price}
                features={property.features}
                location={property.location}
                image={property.image}
                images={property.images}
                featured={property.featured}
                isNew={property.isNew}
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
