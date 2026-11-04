import { NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/api/events";

/** GET /api/events - Próximos eventos publicados (en curso o por venir), para Client Components. */
export async function GET() {
  return NextResponse.json(await getUpcomingEvents());
}
