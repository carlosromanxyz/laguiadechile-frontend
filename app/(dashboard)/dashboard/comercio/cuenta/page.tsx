import { permanentRedirect } from "next/navigation";
import { dashboardProfileHref } from "@/config/dashboard-navigation";

/** «Perfil y cuenta» del comercio: el perfil de toda cuenta vive en `/dashboard/perfil` (CLGDC-155). */
export default function ComercioCuentaPage() {
  permanentRedirect(dashboardProfileHref);
}
