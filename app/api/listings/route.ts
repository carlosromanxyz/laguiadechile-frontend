import { NextResponse } from "next/server";
import { getListings } from "@/lib/api/listings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const items = await getListings(
    type === "comercio" || type === "servicio" ? type : undefined,
  );
  return NextResponse.json(items);
}
