import { ExternalLink, Globe, Mail, Phone } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import type { IPlace } from "@/interfaces/place";
import { telHref } from "@/lib/format/places";
import { PLACE_ACTION_CLASS } from "@/lib/ui/places";
import { cn } from "@/lib/utils";

interface LDCPlaceContactProps {
  place: Pick<IPlace, "title" | "type" | "phone" | "website" | "email" | "emergencyNumber">;
  className?: string;
}

/**
 * LDCPlaceContact - Panel «Contacto» de la ficha de un lugar (CLGDC-207)
 *
 * Teléfono (`tel:` con solo dígitos y `+`), sitio web (otra pestaña, `noopener`) y email
 * (`mailto:`), como acciones outline de 44 px. En un servicio público con número de emergencia
 * recuerda que la oficina no atiende emergencias. Sin ningún contacto no se dibuja.
 *
 * @example
 * <LDCPlaceContact place={place} />
 */
export function LDCPlaceContact({ place, className }: LDCPlaceContactProps) {
  const phone = telHref(place.phone);
  const website = place.website && /^https?:\/\//i.test(place.website) ? place.website : undefined;
  if (!phone && !website && !place.email) return null;

  return (
    <LDCPanel className={className}>
      <h3 className="mb-4 flex items-center gap-2 font-mulish text-lg font-bold text-foreground">
        <Phone className="size-5 text-pink" aria-hidden />
        Contacto
      </h3>
      <div className="flex flex-wrap gap-2">
        {phone && (
          <a href={phone} aria-label={`Llamar a ${place.title}, ${place.phone}`} className={cn(PLACE_ACTION_CLASS, "flex-1 basis-32")}>
            <Phone aria-hidden />
            <span className="tabular-nums">{place.phone}</span>
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Sitio web de ${place.title} (se abre en otra pestaña)`}
            className={cn(PLACE_ACTION_CLASS, "flex-1 basis-32")}
          >
            <Globe aria-hidden />
            Sitio web
            <ExternalLink aria-hidden />
          </a>
        )}
        {place.email && (
          <a
            href={`mailto:${encodeURIComponent(place.email).replace(/%40/g, "@")}`}
            aria-label={`Escribir a ${place.title}, ${place.email}`}
            className={cn(PLACE_ACTION_CLASS, "flex-1 basis-32")}
          >
            <Mail aria-hidden />
            Email
          </a>
        )}
      </div>
      {place.type === "PUBLIC_SERVICE" && place.emergencyNumber && phone && (
        <p className="mt-3 font-open-sans text-sm text-muted-foreground">
          El teléfono de la oficina no atiende emergencias: llama al{" "}
          <span className="font-semibold tabular-nums text-foreground">{place.emergencyNumber}</span>.
        </p>
      )}
    </LDCPanel>
  );
}
