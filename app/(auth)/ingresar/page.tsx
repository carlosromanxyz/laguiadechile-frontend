import type { Metadata } from "next";
import { LDCAuthCard } from "@/components/molecules/ldc-auth-card";
import { LDCAuthCover } from "@/components/organisms/ldc-auth-cover";
import { LDCRoleGateway } from "@/components/organisms/ldc-role-gateway";
import { LDCAuthTemplate } from "@/components/templates/ldc-auth-template";
import { getAuthCoverData } from "@/lib/api/auth-cover";

export const metadata: Metadata = {
  title: "Ingresar — La Guía de Chile",
};

/** Acceso común: reparte a `/ingresar/comercio` y `/ingresar/usuario` (el admin no aparece). */
export default async function IngresarPage() {
  const cover = await getAuthCoverData();

  return (
    <LDCAuthTemplate aside={cover ? <LDCAuthCover {...cover} /> : undefined}>
      <LDCAuthCard bare title="Ingresa a La Guía de Chile" description="Elige cómo usas la guía.">
        <LDCRoleGateway />
      </LDCAuthCard>
    </LDCAuthTemplate>
  );
}
