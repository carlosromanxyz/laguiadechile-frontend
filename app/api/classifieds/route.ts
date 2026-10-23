import { NextResponse } from "next/server";
import { getClassifieds } from "@/lib/api/classifieds";

export async function GET() {
  return NextResponse.json(await getClassifieds());
}
