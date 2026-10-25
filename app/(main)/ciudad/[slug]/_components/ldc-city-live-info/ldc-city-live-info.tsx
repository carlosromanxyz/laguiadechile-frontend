"use client";

import { LDCWeatherWidget } from "@/components/organisms/ldc-weather-widget";
import { LDCPharmacyBanner } from "@/components/organisms/ldc-pharmacy-banner";
import { useCityWeather } from "@/hooks/use-city-weather";
import { useOnDutyPharmacy } from "@/hooks/use-on-duty-pharmacy";

interface LDCCityLiveInfoProps {
  /** Nombre de la ciudad (con tildes; los hooks las quitan al pedir) */
  cityName: string;
}

/**
 * LDCCityLiveInfo - Clima y farmacia de turno de la ciudad
 *
 * Contenedor cliente: la página de ciudad es estática, así que el clima y la farmacia de turno
 * se piden en el navegador (`/api/weather` y `/api/pharmacies`) y se pasan a los organismos
 * presentacionales. Devuelve los dos como hermanos para que la grilla del template los ubique.
 */
export function LDCCityLiveInfo({ cityName }: LDCCityLiveInfoProps) {
  const { weather, loading: weatherLoading } = useCityWeather(cityName);
  const { pharmacy, loading: pharmacyLoading } = useOnDutyPharmacy(cityName);

  return (
    <>
      <LDCWeatherWidget weather={weather} loading={weatherLoading} variant="card" />
      <LDCPharmacyBanner pharmacy={pharmacy} loading={pharmacyLoading} />
    </>
  );
}
