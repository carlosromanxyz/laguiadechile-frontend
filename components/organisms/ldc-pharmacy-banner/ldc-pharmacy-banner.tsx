import { cn } from "@/lib/utils";
import { Cross, MapPin, Phone } from "lucide-react";
import type { IPharmacy } from "@/interfaces/pharmacy";

interface LDCPharmacyBannerProps {
  /** Farmacia de turno; `null` no pinta nada (salvo mientras `loading`) */
  pharmacy: Pick<IPharmacy, "name" | "address" | "phone"> | null;
  /** Muestra el esqueleto de carga */
  loading?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPharmacyBanner - On-Duty Pharmacy Banner
 *
 * Presentacional: muestra la farmacia de turno que recibe o un esqueleto mientras `loading`.
 * Los datos los pide `useOnDutyPharmacy`.
 *
 * @example
 * ```tsx
 * const { pharmacy, loading } = useOnDutyPharmacy("Santiago");
 * <LDCPharmacyBanner pharmacy={pharmacy} loading={loading} />
 * ```
 */
export function LDCPharmacyBanner({ pharmacy, loading = false, className }: LDCPharmacyBannerProps) {
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
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Farmacia de Turno
          </span>

          {/* Pharmacy Name & Details */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <h3 className="font-bold text-lg text-foreground">
              {pharmacy.name}
            </h3>

            {/* Address */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>{pharmacy.address}</span>
            </div>

            {/* Phone */}
            {pharmacy.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
