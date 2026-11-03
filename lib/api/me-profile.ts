import "server-only";
import type { IMyPasswordChange, IMyProfile, IMyProfileUpdate } from "@/interfaces/profile";
import { apiFetchServer } from "@/lib/api-client";
import { toLDCRoles } from "@/lib/auth/backend-role";

/** Lo que devuelven `GET /me` y `PATCH /me` (roles del enum `Role` del backend). */
interface RawMyProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
  createdAt: string;
}

const mapMyProfile = (p: RawMyProfile): IMyProfile => ({
  id: p.id,
  email: p.email,
  name: p.name,
  roles: toLDCRoles(p.roles),
  createdAt: p.createdAt,
});

/**
 * Perfil propio con la sesión del request (`GET /me`, cualquier rol). Un error del backend se
 * propaga: la página no debe mostrar un formulario vacío si la API cae.
 */
export async function getMyProfile(): Promise<IMyProfile> {
  return mapMyProfile(await apiFetchServer<RawMyProfile>("/me"));
}

/** Cambia el nombre (`PATCH /me`; el backend lo recorta y exige 1 a 100 caracteres). */
export async function updateMyProfile(data: IMyProfileUpdate): Promise<IMyProfile> {
  const raw = await apiFetchServer<RawMyProfile>("/me", {
    method: "PATCH",
    body: JSON.stringify({ name: data.name }),
  });
  return mapMyProfile(raw);
}

/**
 * Cambia la contraseña (`POST /me/password`). 400 si la actual no coincide o la nueva es igual;
 * 429 tras 5 intentos en 15 minutos. La sesión vigente sigue abierta.
 */
export async function changeMyPassword(data: IMyPasswordChange): Promise<void> {
  await apiFetchServer<{ status: string }>("/me/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
  });
}
