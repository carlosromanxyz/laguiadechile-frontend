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
 * ```
 */
export function LDCWeatherWidget({ cityName, className }: LDCWeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

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
          "flex items-center gap-5 px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 animate-pulse",
          className
        )}
      >
        <div className="w-16 h-16 rounded-full bg-white/20" />
        <div className="space-y-3">
          <div className="w-20 h-8 rounded bg-white/20" />
          <div className="w-28 h-4 rounded bg-white/20" />
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
        "flex items-center gap-5 px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20",
        className
      )}
    >
      {/* Weather Icon */}
      <span className="text-6xl" role="img" aria-label={description}>
        {icon}
      </span>

      {/* Temperature and Description */}
      <div className="text-white">
        <p className="text-4xl font-bold font-mulish leading-none">
          {weather.temperature}°C
        </p>
        <p className="text-base text-white/80 mt-1">{description}</p>
      </div>
    </div>
  );
}
