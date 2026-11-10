import type { LDCRole } from "@/lib/auth/roles";

/** Fila de `GET /admin/users` (CLGDC-120), con los roles ya traducidos a `LDCRole`. */
export interface IAdminUserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  /** En el orden de `LDC_ROLE_KEYS`; `usuario` siempre está (la API lo suma) */
  roles: LDCRole[];
  createdAt: string;
  counts: { listings: number; classifieds: number };
}

/** Página de `GET /admin/users`. */
export interface IAdminUserPage {
  items: IAdminUserRow[];
  total: number;
  page: number;
  limit: number;
}
