import { NextResponse } from "next/server";
import { getRegions } from "@/lib/api/catalog";

export async function GET() {
  return NextResponse.json(await getRegions());
}
