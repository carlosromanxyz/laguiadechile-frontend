"use client";

import { useEffect, useState } from "react";
import type { IPharmaciesResponse, IPharmacy } from "@/interfaces/pharmacy";
import { stripAccents } from "@/lib/format/text";

interface UseOnDutyPharmacyResult {
  /** Primera farmacia de turno de la comuna, o `null` si no hay */
  pharmacy: IPharmacy | null;
  /** Si la petición sigue en curso */
  loading: boolean;
}

/**
 * useOnDutyPharmacy - Farmacia de turno de una comuna
 *
 * Pide `/api/pharmacies?comuna=<ciudad sin tildes>` en el cliente (el turno cambia cada día y
 * la página de ciudad es estática) y se queda con la primera farmacia.
 */
export function useOnDutyPharmacy(cityName: string): UseOnDutyPharmacyResult {
  const [pharmacy, setPharmacy] = useState<IPharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPharmacy() {
      setLoading(true);
      try {
        const response = await fetch(`/api/pharmacies?comuna=${encodeURIComponent(stripAccents(cityName))}`);
        if (response.ok) {
          const data: Partial<IPharmaciesResponse> = await response.json();
          if (data.pharmacies && data.pharmacies.length > 0) {
            setPharmacy(data.pharmacies[0]);
          } else {
            setPharmacy(null);
          }
        } else {
          setPharmacy(null);
        }
      } catch {
        setPharmacy(null);
      }
      setLoading(false);
    }

    fetchPharmacy();
  }, [cityName]);

  return { pharmacy, loading };
}
