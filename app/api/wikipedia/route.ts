import { NextRequest, NextResponse } from "next/server";
import { IWikipediaSummary } from "@/interfaces/wikipedia";

/**
 * Wikipedia API Route Handler
 *
 * Proxies requests to Spanish Wikipedia API for city summaries.
 * Returns title, extract (description), thumbnail image, and link.
 *
 * @example GET /api/wikipedia?city=Santiago
 */

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
    // Try with "(Chile)" suffix first for disambiguation
    let response = await fetch(
      `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}_(Chile)`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    // If not found, try without suffix
    if (!response.ok) {
      response = await fetch(
        `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`,
        { next: { revalidate: 86400 } }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "City not found in Wikipedia" },
        { status: 404 }
      );
    }

    const data: IWikipediaSummary = await response.json();

    // Return only the fields we need
    return NextResponse.json({
      title: data.title,
      extract: data.extract,
      thumbnail: data.thumbnail,
      url: data.content_urls.desktop.page,
      description: data.description,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
