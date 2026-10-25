import "server-only";

import type { IWeatherData } from "@/interfaces/weather";
import { ExternalServiceError } from "./errors";

/**
 * Clima actual desde Open-Meteo (gratis, sin API key). https://open-meteo.com/
 *
 * Solo servidor: lo usa el route handler `/api/weather`, que es lo que pide el cliente.
 */

interface GeocodingResult {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
  }>;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
}

/**
 * Clima actual de una ciudad chilena por nombre.
 *
 * @throws {ExternalServiceError} 502 si falla Open-Meteo, 404 si no encuentra la ciudad.
 */
export async function getWeatherByCity(city: string): Promise<IWeatherData> {
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&country=CL`,
    { next: { revalidate: 86400 } }, // 24 horas
  );

  if (!geoResponse.ok) {
    throw new ExternalServiceError(502, "Failed to geocode city");
  }

  const geoData: GeocodingResult = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new ExternalServiceError(404, "City not found");
  }

  const { latitude, longitude } = geoData.results[0];

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=America/Santiago`,
    { next: { revalidate: 300 } }, // 5 minutos
  );

  if (!weatherResponse.ok) {
    throw new ExternalServiceError(502, "Failed to fetch weather");
  }

  const weatherData: OpenMeteoResponse = await weatherResponse.json();

  return {
    temperature: Math.round(weatherData.current.temperature_2m),
    weatherCode: weatherData.current.weather_code,
    isDay: weatherData.current.is_day === 1,
  };
}
