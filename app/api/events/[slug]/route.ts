import { NextResponse } from "next/server";
import { getEventBySlug } from "@/lib/api/events";

/** GET /api/events/:slug - Un evento publicado; 404 si no existe o no está publicado. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const item = await getEventBySlug(slug);
  if (!item) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(item);
}
