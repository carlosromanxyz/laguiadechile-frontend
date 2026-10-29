import { redirect } from "next/navigation";
import { getDashboardSession } from "@/lib/dashboard/session";

/**
 * `/publicar` público: sin sesión válida, al registro (toda cuenta nace como usuario); con sesión,
 * a la página de alta del panel (`/dashboard/publicar`), que exige usuario o comercio (el admin
 * termina en su inicio).
 */
export default async function PublicarPage() {
  const session = await getDashboardSession();
  redirect(session ? "/dashboard/publicar" : "/registro");
}
