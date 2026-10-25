"use client";

import { useEffect, useState } from "react";
import type { IWikipediaCityInfo } from "@/interfaces/wikipedia";

interface UseCityWikipediaResult {
  /** Resumen de Wikipedia, o `null` si no hay (error o página inexistente) */
  data: IWikipediaCityInfo | null;
  /** Si la petición sigue en curso */
  loading: boolean;
}

/**
 * useCityWikipedia - Resumen de Wikipedia de una ciudad
 *
 * Pide `/api/wikipedia?city=<ciudad>` en el cliente. Leerlo en el build no sirve: la ráfaga de
 * peticiones de todas las ciudades choca con el límite de Wikipedia (429) y el HTML sale
 * distinto en cada build.
 */
export function useCityWikipedia(cityName: string): UseCityWikipediaResult {
  const [data, setData] = useState<IWikipediaCityInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWikipediaData() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/wikipedia?city=${encodeURIComponent(cityName)}`
        );
        if (response.ok) {
          const result: IWikipediaCityInfo = await response.json();
          setData(result);
        } else {
          setData(null);
        }
      } catch {
        setData(null);
      }
      setLoading(false);
    }

    fetchWikipediaData();
  }, [cityName]);

  return { data, loading };
}
