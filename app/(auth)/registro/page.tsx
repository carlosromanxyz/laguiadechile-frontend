import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LDCAuthCard } from "@/components/molecules/ldc-auth-card";
import { LDCAuthCover } from "@/components/organisms/ldc-auth-cover";
import { LDCRegisterForm } from "@/components/organisms/ldc-register-form";
import { LDCAuthTemplate } from "@/components/templates/ldc-auth-template";
import { getAuthCoverData } from "@/lib/api/auth-cover";
import { LDC_REGISTER } from "@/lib/auth/roles";
import { getDashboardSession } from "@/lib/dashboard/session";

export const metadata: Metadata = {
  title: "Crea tu cuenta — La Guía de Chile",
};

/**
 * Registro público: una sola página, sin elegir rol. La cuenta nace como usuario y cae en
 * `/dashboard`. Con sesión, al inicio del panel.
 */
export default async function RegisterPage() {
  const session = await getDashboardSession();
  if (session) redirect("/dashboard");

  const cover = await getAuthCoverData();

  return (
    <LDCAuthTemplate aside={cover ? <LDCAuthCover {...cover} /> : undefined}>
      <LDCAuthCard
        bare
        role={LDC_REGISTER.role}
        title={LDC_REGISTER.title}
        description={LDC_REGISTER.description}
      >
        <LDCRegisterForm />
      </LDCAuthCard>
    </LDCAuthTemplate>
  );
}
