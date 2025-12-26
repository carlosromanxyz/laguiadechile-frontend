import { NextRequest, NextResponse } from "next/server";

/**
 * Weather API Route Handler
 *
 * Proxies requests to Open-Meteo API for weather data.
 * This centralizes external API calls and allows for caching.
 *
 * @example GET /api/weather?city=Santiago
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Get coordinates from city name
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&country=CL`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!geoResponse.ok) {
      return NextResponse.json(
        { error: "Failed to geocode city" },
        { status: 502 }
      );
    }

    const geoData: GeocodingResult = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json(
        { error: "City not found" },
        { status: 404 }
      );
    }

    const { latitude, longitude } = geoData.results[0];

    // Get weather data
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=America/Santiago`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch weather" },
        { status: 502 }
      );
    }

    const weatherData: OpenMeteoResponse = await weatherResponse.json();

    return NextResponse.json({
      temperature: Math.round(weatherData.current.temperature_2m),
      weatherCode: weatherData.current.weather_code,
      isDay: weatherData.current.is_day === 1,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
