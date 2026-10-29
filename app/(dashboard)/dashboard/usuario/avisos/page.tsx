import { redirect } from "next/navigation";

/** «Mis avisos» se mudó a `/dashboard/avisos` (grupo propio del rol avisador). */
export default function UsuarioAvisosPage() {
  redirect("/dashboard/avisos");
}
