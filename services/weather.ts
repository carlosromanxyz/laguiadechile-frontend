/**
 * Weather Service
 *
 * Fetches weather data from Open-Meteo API.
 * Free API, no key required.
 * https://open-meteo.com/
 */

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
}

interface GeocodingResult {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
  }>;
}

/**
 * Weather code descriptions and icons
 * Based on WMO Weather interpretation codes
 * https://open-meteo.com/en/docs
 */
export const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: "Despejado", icon: "☀️" },
  1: { description: "Mayormente despejado", icon: "🌤️" },
  2: { description: "Parcialmente nublado", icon: "⛅" },
  3: { description: "Nublado", icon: "☁️" },
  45: { description: "Neblina", icon: "🌫️" },
  48: { description: "Neblina con escarcha", icon: "🌫️" },
  51: { description: "Llovizna ligera", icon: "🌦️" },
  53: { description: "Llovizna moderada", icon: "🌦️" },
  55: { description: "Llovizna intensa", icon: "🌧️" },
  61: { description: "Lluvia ligera", icon: "🌧️" },
  63: { description: "Lluvia moderada", icon: "🌧️" },
  65: { description: "Lluvia intensa", icon: "🌧️" },
  71: { description: "Nieve ligera", icon: "🌨️" },
  73: { description: "Nieve moderada", icon: "🌨️" },
  75: { description: "Nieve intensa", icon: "❄️" },
  80: { description: "Chubascos ligeros", icon: "🌦️" },
  81: { description: "Chubascos moderados", icon: "🌧️" },
  82: { description: "Chubascos intensos", icon: "⛈️" },
  95: { description: "Tormenta", icon: "⛈️" },
  96: { description: "Tormenta con granizo", icon: "⛈️" },
  99: { description: "Tormenta con granizo intenso", icon: "⛈️" },
};

/**
 * Get weather icon based on weather code and day/night
 */
export function getWeatherIcon(code: number, isDay: boolean): string {
  const weather = weatherCodes[code] || weatherCodes[0];

  // Replace sun icons with moon for night
  if (!isDay && code <= 2) {
    return code === 0 ? "🌙" : "🌙";
  }

  return weather.icon;
}

/**
 * Get weather description in Spanish
 */
export function getWeatherDescription(code: number): string {
  return weatherCodes[code]?.description || "Desconocido";
}

/**
 * Get coordinates for a city using Open-Meteo Geocoding API
 */
export async function getCityCoordinates(cityName: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=es&country=CL`
    );

    if (!response.ok) return null;

    const data: GeocodingResult = await response.json();

    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch current weather for coordinates
 */
export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=America/Santiago`
    );

    if (!response.ok) return null;

    const data: OpenMeteoResponse = await response.json();

    return {
      temperature: Math.round(data.current.temperature_2m),
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch weather for a city by name
 */
export async function getWeatherByCity(cityName: string): Promise<WeatherData | null> {
  const coords = await getCityCoordinates(cityName);
  if (!coords) return null;

  return getWeather(coords.lat, coords.lon);
}
