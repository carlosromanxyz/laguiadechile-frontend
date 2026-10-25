"use client";

import { LDCWikipediaSection } from "@/components/organisms/ldc-wikipedia-section";
import { useCityWikipedia } from "@/hooks/use-city-wikipedia";

interface LDCCityWikipediaProps {
  /** Nombre de la ciudad (con tildes, tal cual) */
  cityName: string;
}

/**
 * LDCCityWikipedia - Resumen de Wikipedia de la ciudad
 *
 * Contenedor cliente: pide `/api/wikipedia` en el navegador y se lo pasa al organismo
 * presentacional `LDCWikipediaSection`.
 */
export function LDCCityWikipedia({ cityName }: LDCCityWikipediaProps) {
  const { data, loading } = useCityWikipedia(cityName);

  return <LDCWikipediaSection cityName={cityName} data={data} loading={loading} />;
}
