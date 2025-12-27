import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Pharmacies API Route Handler
 *
 * Proxies requests to Boostr API for pharmacy data.
 * Returns on-duty pharmacies filtered by comuna (city).
 * Uses curl to bypass Cloudflare protection that blocks Node.js fetch.
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
    // Use curl to fetch from Boostr API (bypasses Cloudflare blocking of Node.js)
    const { stdout } = await execAsync(
      'curl -s "https://api.boostr.cl/pharmacies/24h.json"',
      { timeout: 10000 }
    );

    const data: BoostrResponse = JSON.parse(stdout);

    if (data.status !== "success" || !data.data) {
      console.error("[Pharmacies API] Invalid response structure");
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
