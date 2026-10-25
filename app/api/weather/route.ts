import { NextRequest, NextResponse } from "next/server";
import { getWeatherByCity } from "@/lib/external/weather";
import { ExternalServiceError } from "@/lib/external/errors";

/**
 * Weather API Route Handler
 *
 * Clima actual de Open-Meteo para el cliente (lo pide `useCityWeather`).
 *
 * @example GET /api/weather?city=Santiago
 */
export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(await getWeatherByCity(city));
  } catch (error) {
    if (error instanceof ExternalServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
