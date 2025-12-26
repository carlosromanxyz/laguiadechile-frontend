import { NextRequest, NextResponse } from "next/server";

/**
 * Pharmacies API Route Handler
 *
 * Proxies requests to Boostr API for pharmacy data.
 * Returns on-duty pharmacies filtered by comuna (city).
 *
 * @example GET /api/pharmacies?comuna=Santiago
 */

interface BoostrPharmacy {
  local_nombre: string;
  local_direccion: string;
  local_telefono: string;
  comuna_nombre: string;
  localidad_nombre: string;
  funcionamiento_hora_apertura: string;
  funcionamiento_hora_cierre: string;
  local_lat: string;
  local_lng: string;
}

interface BoostrResponse {
  status: string;
  data: BoostrPharmacy[];
}

export interface Pharmacy {
  name: string;
  address: string;
  phone: string;
  comuna: string;
  locality: string;
  openTime: string;
  closeTime: string;
  lat: number;
  lng: number;
}

function transformPharmacy(pharmacy: BoostrPharmacy): Pharmacy {
  return {
    name: pharmacy.local_nombre,
    address: pharmacy.local_direccion,
    phone: pharmacy.local_telefono,
    comuna: pharmacy.comuna_nombre,
    locality: pharmacy.localidad_nombre,
    openTime: pharmacy.funcionamiento_hora_apertura,
    closeTime: pharmacy.funcionamiento_hora_cierre,
    lat: parseFloat(pharmacy.local_lat),
    lng: parseFloat(pharmacy.local_lng),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const comuna = searchParams.get("comuna");

  try {
    // Fetch on-duty pharmacies from Boostr API
    const response = await fetch("https://api.boostr.cl/pharmacies-24h.json", {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch pharmacies" },
        { status: 502 }
      );
    }

    const data: BoostrResponse = await response.json();

    if (data.status !== "success" || !data.data) {
      return NextResponse.json(
        { error: "Invalid response from pharmacy API" },
        { status: 502 }
      );
    }

    let pharmacies = data.data.map(transformPharmacy);

    // Filter by comuna if provided
    if (comuna) {
      const comunaNormalized = comuna.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      pharmacies = pharmacies.filter((pharmacy) => {
        const pharmacyComunaNormalized = pharmacy.comuna
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return pharmacyComunaNormalized.includes(comunaNormalized) ||
               comunaNormalized.includes(pharmacyComunaNormalized);
      });
    }

    return NextResponse.json({
      pharmacies,
      count: pharmacies.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
