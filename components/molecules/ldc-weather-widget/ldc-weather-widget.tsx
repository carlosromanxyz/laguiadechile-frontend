"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getWeatherByCity,
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
      const data = await getWeatherByCity(cityName);
      setWeather(data);
      setLoading(false);
    }

    fetchWeather();
  }, [cityName]);

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 animate-pulse",
          className
        )}
      >
        <div className="w-10 h-10 rounded-full bg-white/20" />
        <div className="space-y-2">
          <div className="w-12 h-5 rounded bg-white/20" />
          <div className="w-20 h-3 rounded bg-white/20" />
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
        "flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20",
        className
      )}
    >
      {/* Weather Icon */}
      <span className="text-4xl" role="img" aria-label={description}>
        {icon}
      </span>

      {/* Temperature and Description */}
      <div className="text-white">
        <p className="text-2xl font-bold font-mulish leading-none">
          {weather.temperature}°C
        </p>
        <p className="text-sm text-white/80 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
