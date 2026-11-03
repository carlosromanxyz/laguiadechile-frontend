import { LDCPanel } from "@/components/atoms/ldc-panel";
import { Bed, Bath, Car, Maximize, LandPlot } from "lucide-react";
import type { IProperty, PropertyType } from "@/interfaces/property";
import { getPropertyRooms } from "@/lib/format/properties";

interface LDCPropertyFeaturesProps {
  /** Tipo de propiedad: define si aplican dormitorios y baños */
  type: PropertyType;
  features: IProperty["features"];
  className?: string;
}

/**
 * LDCPropertyFeatures - Feature Grid for Property Detail Pages
 *
 * Displays surface, bedrooms, bathrooms and parking with icons.
 * Includes total surface when available (e.g. houses with land).
 * Omite dormitorios, baños y estacionamientos si no vienen informados o no aplican al tipo.
 */
export function LDCPropertyFeatures({
  type,
  features,
  className,
}: LDCPropertyFeaturesProps) {
  const { bedrooms, bathrooms, parking } = getPropertyRooms(type, features);
  const items = [
    { icon: Maximize, value: `${features.surface} m²`, label: "Superficie útil" },
    ...(features.totalSurface
      ? [
          {
            icon: LandPlot,
            value: `${features.totalSurface} m²`,
            label: "Superficie total",
          },
        ]
      : []),
    ...(bedrooms !== undefined
      ? [{ icon: Bed, value: bedrooms, label: bedrooms === 1 ? "Dormitorio" : "Dormitorios" }]
      : []),
    ...(bathrooms !== undefined
      ? [{ icon: Bath, value: bathrooms, label: bathrooms === 1 ? "Baño" : "Baños" }]
      : []),
    ...(parking !== undefined
      ? [{ icon: Car, value: parking, label: parking === 1 ? "Estacionamiento" : "Estacionamientos" }]
      : []),
  ];

  return (
    <LDCPanel padding="lg" className={className}>
      <h2 className="text-xl font-bold font-mulish text-foreground mb-4">
        Características
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg bg-muted/40 p-3"
          >
            <Icon className="w-6 h-6 text-pink flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-base font-bold font-mulish text-foreground leading-tight">
                {value}
              </p>
              <p className="text-xs text-muted-foreground truncate">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </LDCPanel>
  );
}
