import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCPasswordChangeForm } from "@/components/organisms/ldc-password-change-form";
import { LDCProfileDetailsForm } from "@/components/organisms/ldc-profile-details-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getMyProfile } from "@/lib/api/me-profile";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { changeMyPasswordAction, updateMyProfileAction } from "./actions";

export const metadata = {
  title: "Perfil — Panel",
};

/**
 * Perfil de toda cuenta (CLGDC-155, alternativa A del lienzo CLGDC-115): una columna de 672 px
 * con un panel por formulario, «Tus datos» (`PATCH /me`) y «Contraseña» (`POST /me/password`).
 */
export default async function DashboardPerfilPage() {
  await requireDashboardSession();
  const profile = await getMyProfile();

  return (
    <LDCDashboardPageTemplate title="Perfil" description="Tu nombre, tu correo y tu contraseña.">
      <div className="max-w-2xl space-y-6">
        <LDCPanel as="section" aria-labelledby="perfil-datos" className="p-0">
          <LDCProfileDetailsForm profile={profile} headingId="perfil-datos" action={updateMyProfileAction} />
        </LDCPanel>
        <LDCPanel as="section" aria-labelledby="perfil-contrasena" className="p-0">
          <LDCPasswordChangeForm
            email={profile.email}
            headingId="perfil-contrasena"
            action={changeMyPasswordAction}
          />
        </LDCPanel>
      </div>
    </LDCDashboardPageTemplate>
  );
}
