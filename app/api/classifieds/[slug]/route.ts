import { NextResponse } from "next/server";
import { getClassifiedBySlug } from "@/lib/api/classifieds";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const item = await getClassifiedBySlug(slug);
  if (!item) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(item);
}
