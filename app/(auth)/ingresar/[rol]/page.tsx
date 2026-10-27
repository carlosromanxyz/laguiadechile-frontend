import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LDCBackLink } from "@/components/atoms/ldc-back-link";
import { LDCAuthCard } from "@/components/molecules/ldc-auth-card";
import { LDCAuthCover } from "@/components/organisms/ldc-auth-cover";
import { LDCLoginForm } from "@/components/organisms/ldc-login-form";
import { LDCAuthTemplate } from "@/components/templates/ldc-auth-template";
import { getAuthCoverData } from "@/lib/api/auth-cover";
import { getRoleConfig, isLDCPublicRole, LDC_PUBLIC_ROLE_KEYS } from "@/lib/auth/roles";

interface RoleLoginPageProps {
  params: Promise<{ rol: string }>;
}

/** Solo los roles con login público; el admin entra por `/dashboard/login`. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LDC_PUBLIC_ROLE_KEYS.map((rol) => ({ rol }));
}

export async function generateMetadata({ params }: RoleLoginPageProps): Promise<Metadata> {
  const { rol } = await params;
  if (!isLDCPublicRole(rol)) return {};
  return { title: `Ingresar como ${getRoleConfig(rol).label.toLowerCase()} — La Guía de Chile` };
}

/** Login de un rol (comercio o usuario). El envío es simulado: sin backend. */
export default async function RoleLoginPage({ params }: RoleLoginPageProps) {
  const { rol } = await params;
  if (!isLDCPublicRole(rol)) notFound();

  const config = getRoleConfig(rol);
  const cover = await getAuthCoverData();

  return (
    <LDCAuthTemplate aside={cover ? <LDCAuthCover {...cover} /> : undefined}>
      <LDCAuthCard
        bare
        role={rol}
        title={config.title}
        description={config.description}
        back={<LDCBackLink href="/ingresar" label="Cambiar tipo de cuenta" />}
      >
        <LDCLoginForm role={rol} />
      </LDCAuthCard>
    </LDCAuthTemplate>
  );
}
