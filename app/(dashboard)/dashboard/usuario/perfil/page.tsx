import { permanentRedirect } from "next/navigation";
import { dashboardProfileHref } from "@/config/dashboard-navigation";

/** Ruta vieja del perfil: el perfil de toda cuenta vive en `/dashboard/perfil` (CLGDC-155). */
export default function UsuarioPerfilPage() {
  permanentRedirect(dashboardProfileHref);
}
