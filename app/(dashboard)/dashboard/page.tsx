import { Folder, Home, MapPin, Newspaper, Store, Tags } from "lucide-react";
import { LDCStatCard } from "@/components/molecules/ldc-stat-card";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { apiFetchServer } from "@/lib/api-client";

async function safeCount(path: string): Promise<number> {
  try {
    const data = await apiFetchServer<unknown[]>(path);
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export default async function DashboardHomePage() {
  const [listings, classifieds, properties, news, categories, cities] = await Promise.all([
    safeCount("/listings?limit=200"),
    safeCount("/classifieds?limit=200&includeExpired=true"),
    safeCount("/properties?limit=200"),
    safeCount("/news?limit=200"),
    safeCount("/categories?limit=200"),
    safeCount("/cities?limit=500"),
  ]);

  return (
    <LDCDashboardPageTemplate title="Inicio" description="Vista general del contenido publicado.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LDCStatCard label="Comercios y servicios" value={listings} icon={<Store className="size-4" />} />
        <LDCStatCard label="Avisos clasificados" value={classifieds} icon={<Tags className="size-4" />} />
        <LDCStatCard label="Propiedades" value={properties} icon={<Home className="size-4" />} />
        <LDCStatCard label="Noticias" value={news} icon={<Newspaper className="size-4" />} />
        <LDCStatCard label="Categorías" value={categories} icon={<Folder className="size-4" />} />
        <LDCStatCard label="Ciudades" value={cities} icon={<MapPin className="size-4" />} />
      </div>
    </LDCDashboardPageTemplate>
  );
}
