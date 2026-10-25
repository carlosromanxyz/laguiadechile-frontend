import { NextRequest, NextResponse } from "next/server";
import { getCityWikipedia } from "@/lib/external/wikipedia";

/**
 * Wikipedia API Route Handler
 *
 * Resumen de una ciudad en la Wikipedia en español: título, extracto, miniatura y enlace.
 * Lo pide el cliente con `useCityWikipedia` en la ficha de ciudad.
 *
 * @example GET /api/wikipedia?city=Santiago
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
    const data = await getCityWikipedia(city);

    if (!data) {
      return NextResponse.json(
        { error: "City not found in Wikipedia" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
