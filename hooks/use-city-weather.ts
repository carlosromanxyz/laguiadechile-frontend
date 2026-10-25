"use client";

import { useEffect, useState } from "react";
import type { IWeatherData } from "@/interfaces/weather";
import { stripAccents } from "@/lib/format/text";

interface UseCityWeatherResult {
  /** Clima actual, o `null` si no hay datos (error o ciudad no encontrada) */
  weather: IWeatherData | null;
  /** Si la petición sigue en curso */
  loading: boolean;
}

/**
 * useCityWeather - Clima actual de una ciudad
 *
 * Pide `/api/weather?city=<ciudad sin tildes>` en el cliente (la página de ciudad es estática
 * y el clima cambia cada pocos minutos).
 */
export function useCityWeather(cityName: string): UseCityWeatherResult {
  const [weather, setWeather] = useState<IWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(stripAccents(cityName))}`);
        if (response.ok) {
          const data: IWeatherData = await response.json();
          setWeather(data);
        } else {
          setWeather(null);
        }
      } catch {
        setWeather(null);
      }
      setLoading(false);
    }

    fetchWeather();
  }, [cityName]);

  return { weather, loading };
}
