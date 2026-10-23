import { Folder, Home, MapPin, Newspaper, Store, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetchServer } from "@/lib/api-client";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inicio</h1>
        <p className="text-sm text-muted-foreground">
          Vista general del contenido publicado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Comercios y servicios" value={listings} icon={<Store className="size-4" />} />
        <StatCard label="Avisos clasificados" value={classifieds} icon={<Tags className="size-4" />} />
        <StatCard label="Propiedades" value={properties} icon={<Home className="size-4" />} />
        <StatCard label="Noticias" value={news} icon={<Newspaper className="size-4" />} />
        <StatCard label="Categorías" value={categories} icon={<Folder className="size-4" />} />
        <StatCard label="Ciudades" value={cities} icon={<MapPin className="size-4" />} />
      </div>
    </div>
  );
}
