import { redirect } from "next/navigation";

/** El inicio del usuario pasó a ser el inicio único del panel (`/dashboard`). */
export default function UsuarioHomePage() {
  redirect("/dashboard");
}
