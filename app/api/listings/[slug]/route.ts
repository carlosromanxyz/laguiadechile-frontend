import { NextResponse } from "next/server";
import { apiGetOrNull } from "@/lib/api/server-fetch";
import { mapListing, type RawListing } from "@/lib/api/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const raw = await apiGetOrNull<RawListing>(`/listings/${slug}`);
  if (!raw) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(mapListing(raw));
}
