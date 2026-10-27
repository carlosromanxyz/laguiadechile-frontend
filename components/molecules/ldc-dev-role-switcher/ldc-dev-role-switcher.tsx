"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRoleConfig, isLDCRole, LDC_ROLE_KEYS, type LDCRole } from "@/lib/auth/roles";
import { getRoleHome, isMockRolesEnabled, MOCK_ROLE_COOKIE } from "@/lib/dashboard/config";

export interface LDCDevRoleSwitcherProps {
  /** Rol simulado actual */
  role: LDCRole;
}

/**
 * LDCDevRoleSwitcher - Cambiador del rol simulado (solo desarrollo)
 *
 * Solo se pinta con `NEXT_PUBLIC_MOCK_ROLES=true`. Reescribe la cookie `ldc-mock-role`, va al
 * inicio del rol elegido y refresca los Server Components.
 *
 * @example
 * <LDCDevRoleSwitcher role="comercio" />
 */
export function LDCDevRoleSwitcher({ role }: LDCDevRoleSwitcherProps) {
  const router = useRouter();
  if (!isMockRolesEnabled()) return null;

  function handleChange(value: string) {
    if (!isLDCRole(value)) return;
    document.cookie = `${MOCK_ROLE_COOKIE}=${value}; path=/; max-age=2592000; samesite=lax`;
    router.push(getRoleHome(value));
    router.refresh();
  }

  return (
    <Select value={role} onValueChange={handleChange}>
      <SelectTrigger size="sm" aria-label="Rol simulado" className="w-auto gap-1.5 border-dashed text-xs">
        <span className="hidden text-muted-foreground sm:inline">Simular:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {LDC_ROLE_KEYS.map((r) => (
          <SelectItem key={r} value={r}>
            {getRoleConfig(r).label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
