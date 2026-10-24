"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LDCLoadMoreButton } from "@/components/atoms/ldc-load-more-button";

interface LDCLoadMoreGridProps {
  /** Ítems visibles ya renderizados: elementos React, cada uno con su `key` (lo demás se ignora) */
  children: ReactNode;
  /** Clases del contenedor de los ítems (grid o lista), se aplican tal cual, sin `cn` */
  gridClassName: string;
  /** Cantidad de ítems pedidos hasta ahora (`visibleCount` de `useLoadMore`) */
  visibleCount: number;
  /** Ítems por página (`pageSize` de `useLoadMore`) */
  pageSize: number;
  /** Si se muestra el botón «Cargar más» */
  hasMore: boolean;
  /** Si el botón está en estado de carga */
  isLoading: boolean;
  /** Acción del botón */
  onLoadMore: () => void;
  /** Texto del botón */
  loadMoreLabel: string;
  /** Texto del botón mientras carga (por defecto: «Cargando...») */
  loadingLabel?: string;
}

/**
 * LDCLoadMoreGrid - Grid paginado con botón «Cargar más»
 *
 * Envuelve cada ítem en una animación de entrada escalonada (Framer Motion) y muestra
 * `LDCLoadMoreButton` debajo mientras queden ítems. No renderiza un contenedor propio
 * alrededor del grid y el botón: se ubica dentro de la sección del consumidor.
 *
 * @example
 * ```tsx
 * <LDCLoadMoreGrid
 *   gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start"
 *   visibleCount={visibleCount}
 *   pageSize={15}
 *   hasMore={hasMore}
 *   isLoading={isLoading}
 *   onLoadMore={loadMore}
 *   loadMoreLabel={`Cargar más (${remainingCount} restantes)`}
 * >
 *   {visibleItems.map((item) => <LDCListingCard key={item.id} {...item} />)}
 * </LDCLoadMoreGrid>
 * ```
 */
export function LDCLoadMoreGrid({
  children,
  gridClassName,
  visibleCount,
  pageSize,
  hasMore,
  isLoading,
  onLoadMore,
  loadMoreLabel,
  loadingLabel = "Cargando...",
}: LDCLoadMoreGridProps) {
  return (
    <>
      <div className={gridClassName}>
        <AnimatePresence mode="popLayout">
          {Children.map(children, (child, index) =>
            isValidElement(child) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index >= visibleCount - pageSize ? (index % pageSize) * 0.05 : 0,
                }}
              >
                {child}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {hasMore && (
        <LDCLoadMoreButton
          onClick={onLoadMore}
          isLoading={isLoading}
          label={loadMoreLabel}
          loadingLabel={loadingLabel}
        />
      )}
    </>
  );
}
