import { NextResponse } from "next/server";
import { getNewsBySlug } from "@/lib/api/news";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(item);
}
