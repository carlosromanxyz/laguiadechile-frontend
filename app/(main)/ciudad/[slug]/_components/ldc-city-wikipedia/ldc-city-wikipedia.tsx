"use client";

import { LDCWikipediaSection } from "@/components/organisms/ldc-wikipedia-section";
import { useCityWikipedia } from "@/hooks/use-city-wikipedia";

interface LDCCityWikipediaProps {
  /** Nombre de la ciudad (con tildes, tal cual) */
  cityName: string;
  /** Foto de la ciudad guardada en el bucket (`City.image`); sin ella, la sección va sin foto */
  image?: string;
}

/**
 * LDCCityWikipedia - Resumen de Wikipedia de la ciudad
 *
 * Contenedor cliente: pide `/api/wikipedia` en el navegador y se lo pasa al organismo
 * presentacional `LDCWikipediaSection`, junto con la foto propia de la ciudad (nunca la miniatura de
 * Wikimedia, CLGDC-145).
 */
export function LDCCityWikipedia({ cityName, image }: LDCCityWikipediaProps) {
  const { data, loading } = useCityWikipedia(cityName);

  return <LDCWikipediaSection cityName={cityName} image={image} data={data} loading={loading} />;
}
