"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Cross, MapPin, Phone } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
}

interface LDCPharmacyBannerProps {
  /** City name to fetch pharmacies for */
  cityName: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPharmacyBanner - On-Duty Pharmacy Banner
 *
 * Shows the nearest on-duty pharmacy for a city.
 * Fetches data from Boostr API via internal route handler.
 *
 * @example
 * ```tsx
 * <LDCPharmacyBanner cityName="Santiago" />
 * ```
 */
export function LDCPharmacyBanner({ cityName, className }: LDCPharmacyBannerProps) {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPharmacy() {
      setLoading(true);
      try {
        // Normalize city name to remove accents before sending to API
        const normalizedCityName = cityName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const response = await fetch(`/api/pharmacies?comuna=${encodeURIComponent(normalizedCityName)}`);
        if (response.ok) {
          const data = await response.json();
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

  if (loading) {
    return (
      <div
        className={cn(
          "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 animate-pulse",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-800" />
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 rounded bg-emerald-200 dark:bg-emerald-800" />
            <div className="w-48 h-3 rounded bg-emerald-200 dark:bg-emerald-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!pharmacy) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
          <Cross className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Farmacia de Turno
            </span>
          </div>

          {/* Pharmacy Name */}
          <h3 className="font-bold text-lg text-foreground truncate">
            {pharmacy.name}
          </h3>

          {/* Details */}
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            {/* Address */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span className="truncate">{pharmacy.address}</span>
            </div>

            {/* Phone */}
            {pharmacy.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                <a
                  href={`tel:${pharmacy.phone}`}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {pharmacy.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
