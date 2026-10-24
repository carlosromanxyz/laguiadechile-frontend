"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseLoadMoreOptions {
  /** Ítems que se agregan por cada «Cargar más» (y los visibles al inicio) */
  pageSize: number;
  /** Espera simulada antes de mostrar la página siguiente, en ms (por defecto: 300) */
  delay?: number;
}

interface UseLoadMoreResult<T> {
  /** Ítems que se muestran ahora */
  visibleItems: T[];
  /** Cantidad de ítems pedidos hasta ahora (puede superar el total en la primera página) */
  visibleCount: number;
  /** Si quedan ítems por mostrar */
  hasMore: boolean;
  /** Ítems que faltan por mostrar */
  remainingCount: number;
  /** Si se está «cargando» la página siguiente */
  isLoading: boolean;
  /** Muestra la página siguiente tras `delay` ms */
  loadMore: () => void;
}

/**
 * useLoadMore - Paginación cliente de tipo «Cargar más»
 *
 * Muestra `pageSize` ítems al inicio y agrega otros `pageSize` en cada `loadMore`,
 * con una espera simulada para que el botón muestre su estado de carga.
 *
 * @example
 * ```tsx
 * const { visibleItems, hasMore, remainingCount, isLoading, loadMore } =
 *   useLoadMore(listings, { pageSize: 15 });
 * ```
 */
export function useLoadMore<T>(
  items: readonly T[],
  { pageSize, delay = 300 }: UseLoadMoreOptions
): UseLoadMoreResult<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancela la carga pendiente si el componente se desmonta
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const total = items.length;
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < total;
  const remainingCount = total - visibleCount;

  const loadMore = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setVisibleCount((prev) => Math.min(prev + pageSize, total));
      setIsLoading(false);
    }, delay);
  }, [isLoading, pageSize, total, delay]);

  return { visibleItems, visibleCount, hasMore, remainingCount, isLoading, loadMore };
}
