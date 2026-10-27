import type { IDashboardUser } from "@/interfaces/dashboard";
import type { LDCRole } from "@/lib/auth/roles";

/** Usuarios simulados de cada rol (correos de ejemplo). */
export const MOCK_DASHBOARD_USERS: Record<LDCRole, IDashboardUser> = {
  admin: {
    name: "Carlos Román",
    email: "admin@laguiadechile.cl",
    greetingName: "Carlos",
  },
  comercio: {
    name: "Mascotas Felices SpA",
    email: "contacto@centroveterinariomascotasfelices.cl",
    greetingName: "Mascotas Felices",
  },
  usuario: {
    name: "María Martínez",
    email: "iphone13promax256gb@correo.cl",
    greetingName: "María",
  },
};
