import { redirect } from "next/navigation";
import { LDCAuthCard } from "@/components/molecules/ldc-auth-card";
import { LDCAuthCover, type LDCAuthCoverProps } from "@/components/organisms/ldc-auth-cover";
import { LDCLoginForm } from "@/components/organisms/ldc-login-form";
import { LDCAuthTemplate } from "@/components/templates/ldc-auth-template";
import { getTotalCitiesCount } from "@/lib/api/catalog";
import { getFeaturedListings, getListings } from "@/lib/api/listings";
import { getNews } from "@/lib/api/news";
import { getProperties } from "@/lib/api/properties";
import { getCurrentUser } from "@/lib/auth";
import { LDC_ROLES } from "@/lib/auth/roles";

export const metadata = {
  title: "Iniciar sesión — La Guía de Chile",
};

/** Datos de la portada; si la API falla, el login sigue funcionando sin portada. */
async function getCoverData(): Promise<LDCAuthCoverProps | null> {
  try {
    const [featured, listings, properties, news, cities] = await Promise.all([
      getFeaturedListings(1),
      getListings(),
      getProperties(),
      getNews(),
      getTotalCitiesCount(),
    ]);
    return {
      listing: featured[0] ?? null,
      stats: [
        { value: listings.length, label: "comercios y servicios" },
        { value: properties.length, label: "propiedades" },
        { value: news.length, label: "noticias" },
        { value: cities, label: "ciudades" },
      ],
    };
  } catch {
    return null;
  }
}

export default async function LoginPage() {
  const admin = LDC_ROLES.admin;
  const user = await getCurrentUser();
  if (user) redirect(admin.redirectTo);

  const cover = await getCoverData();

  return (
    <LDCAuthTemplate aside={cover ? <LDCAuthCover {...cover} /> : undefined}>
      <LDCAuthCard bare role="admin" title={admin.title} description={admin.description}>
        <LDCLoginForm role="admin" />
      </LDCAuthCard>
    </LDCAuthTemplate>
  );
}
