import { NextResponse } from "next/server";
import { getNews } from "@/lib/api/news";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;
  const news = await getNews(Number.isFinite(limit) ? limit : undefined);
  return NextResponse.json(news);
}
