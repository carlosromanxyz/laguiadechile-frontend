import { NextResponse } from "next/server";
import { getProperties } from "@/lib/api/properties";

export async function GET() {
  return NextResponse.json(await getProperties());
}
