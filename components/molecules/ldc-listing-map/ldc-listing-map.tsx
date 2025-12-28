import { cn } from "@/lib/utils";
import { MapPin, ExternalLink } from "lucide-react";

interface LDCListingMapProps {
  address: string;
  city: string;
  className?: string;
}

/**
 * LDCListingMap - Google Maps Embed Component
 *
 * Displays an embedded Google Map for a listing's address.
 */
export function LDCListingMap({
  address,
  city,
  className,
}: LDCListingMapProps) {
  const mapQuery = encodeURIComponent(`${address}, ${city}, Chile`);

  return (
    <div className={cn("bg-card rounded-xl border border-border p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-mulish text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-pink" />
          Ubicación
        </h3>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-pink transition-colors"
        >
          Ver en Google Maps
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <p className="text-muted-foreground mb-4">{address}</p>

      <div className="rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height={250}
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          title={`Mapa de ${address}`}
        />
      </div>
    </div>
  );
}
