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
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  latitude: string;
  longitude: string;
}

interface BoostrResponse {
  status: string;
  data: BoostrPharmacy[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  lat: number;
  lng: number;
}

function transformPharmacy(pharmacy: BoostrPharmacy): Pharmacy {
  return {
    id: pharmacy.id,
    name: pharmacy.name,
    address: pharmacy.street,
    phone: pharmacy.phone,
    city: pharmacy.city,
    lat: parseFloat(pharmacy.latitude),
    lng: parseFloat(pharmacy.longitude),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const comuna = searchParams.get("comuna");

  try {
    // Fetch on-duty pharmacies from Boostr API
    const response = await fetch("https://api.boostr.cl/pharmacies/24h.json", {
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

    // Filter by city/comuna if provided
    if (comuna) {
      const comunaNormalized = comuna.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      pharmacies = pharmacies.filter((pharmacy) => {
        const pharmacyCityNormalized = pharmacy.city
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return pharmacyCityNormalized.includes(comunaNormalized) ||
               comunaNormalized.includes(pharmacyCityNormalized);
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
