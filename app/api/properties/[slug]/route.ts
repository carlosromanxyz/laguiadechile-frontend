import { NextResponse } from "next/server";
import { getPropertyBySlug } from "@/lib/api/properties";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const item = await getPropertyBySlug(slug);
  if (!item) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(item);
}
