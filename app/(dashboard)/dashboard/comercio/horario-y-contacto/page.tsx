import { redirect } from "next/navigation";

/** «Horario y contacto» vive dentro de la ficha del comercio (sección `#horario`). */
export default function ComercioHorarioYContactoPage() {
  redirect("/dashboard/comercio/ficha#horario");
}
