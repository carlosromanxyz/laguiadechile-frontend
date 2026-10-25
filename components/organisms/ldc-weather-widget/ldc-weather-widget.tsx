import { cn } from "@/lib/utils";
import { getWeatherDescription, getWeatherIcon } from "@/lib/format/weather";
import type { IWeatherData } from "@/interfaces/weather";

interface LDCWeatherWidgetProps {
  /** Clima actual; `null` no pinta nada (salvo mientras `loading`) */
  weather: IWeatherData | null;
  /** Muestra el esqueleto de carga */
  loading?: boolean;
  /** Optional className for custom styling */
  className?: string;
  /** Variant: 'overlay' for on top of images, 'card' for regular backgrounds */
  variant?: "overlay" | "card";
}

/**
 * LDCWeatherWidget - Weather Display Widget
 *
 * Presentacional: muestra el clima que recibe (temperatura, ícono y descripción) o un
 * esqueleto mientras `loading`. Los datos los pide `useCityWeather`.
 *
 * @example
 * ```tsx
 * const { weather, loading } = useCityWeather("Santiago");
 * <LDCWeatherWidget weather={weather} loading={loading} variant="card" />
 * ```
 */
export function LDCWeatherWidget({ weather, loading = false, className, variant = "overlay" }: LDCWeatherWidgetProps) {
  const isCard = variant === "card";

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
