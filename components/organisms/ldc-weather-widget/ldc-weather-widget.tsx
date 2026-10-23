"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getWeatherIcon,
  getWeatherDescription,
  type WeatherData,
} from "@/services/weather";

interface LDCWeatherWidgetProps {
  /** City name to fetch weather for */
  cityName: string;
  /** Optional className for custom styling */
  className?: string;
  /** Variant: 'overlay' for on top of images, 'card' for regular backgrounds */
  variant?: "overlay" | "card";
}

/**
 * LDCWeatherWidget - Weather Display Widget
 *
 * Shows current weather for a city using Open-Meteo API.
 * Displays temperature, weather icon, and condition description.
 *
 * @example
 * ```tsx
 * <LDCWeatherWidget cityName="Santiago" />
 * <LDCWeatherWidget cityName="Santiago" variant="card" />
 * ```
 */
export function LDCWeatherWidget({ cityName, className, variant = "overlay" }: LDCWeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const isCard = variant === "card";

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      try {
        // Normalize city name to remove accents before sending to API
        const normalizedCityName = cityName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const response = await fetch(`/api/weather?city=${encodeURIComponent(normalizedCityName)}`);
        if (response.ok) {
          const data = await response.json();
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

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 px-4 py-4 rounded-xl animate-pulse",
          isCard
            ? "bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800"
            : "bg-white/10 backdrop-blur-sm border border-white/20",
          className
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full",
          isCard ? "bg-sky-200 dark:bg-sky-800" : "bg-white/20"
        )} />
        <div className="space-y-2">
          <div className={cn(
            "w-16 h-6 rounded",
            isCard ? "bg-sky-200 dark:bg-sky-800" : "bg-white/20"
          )} />
          <div className={cn(
            "w-24 h-3 rounded",
            isCard ? "bg-sky-200 dark:bg-sky-800" : "bg-white/20"
          )} />
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const icon = getWeatherIcon(weather.weatherCode, weather.isDay);
  const description = getWeatherDescription(weather.weatherCode);

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-4 rounded-xl",
        isCard
          ? "bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800"
          : "bg-white/10 backdrop-blur-sm border border-white/20",
        className
      )}
    >
      {/* Weather Icon */}
      <span className="text-5xl" role="img" aria-label={description}>
        {icon}
      </span>

      {/* Temperature and Description */}
      <div className={isCard ? "text-foreground" : "text-white"}>
        <p className="text-3xl font-bold font-mulish leading-none">
          {weather.temperature}°C
        </p>
        <p className={cn(
          "text-sm mt-1",
          isCard ? "text-muted-foreground" : "text-white/80"
        )}>
          {description}
        </p>
      </div>
    </div>
  );
}
