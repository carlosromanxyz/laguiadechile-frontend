import { NextRequest, NextResponse } from "next/server";
import { getOnDutyPharmacies } from "@/lib/external/pharmacies";
import { ExternalServiceError } from "@/lib/external/errors";

/**
 * Pharmacies API Route Handler
 *
 * Farmacias de turno de Boostr para el cliente (lo pide `useOnDutyPharmacy`),
 * filtradas por comuna si viene el parámetro.
 *
 * @example GET /api/pharmacies?comuna=Santiago
 */
export async function GET(request: NextRequest) {
  const comuna = request.nextUrl.searchParams.get("comuna");

  try {
    const pharmacies = await getOnDutyPharmacies(comuna);
    return NextResponse.json({
      pharmacies,
      count: pharmacies.length,
    });
  } catch (error) {
    if (error instanceof ExternalServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
