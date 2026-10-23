import { NextResponse } from "next/server";
import { getCategories } from "@/lib/api/catalog";

export async function GET() {
  return NextResponse.json(await getCategories());
}
