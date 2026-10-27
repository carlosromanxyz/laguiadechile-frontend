"use client";

import { ChevronUp, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LDCAvatar } from "@/components/atoms/ldc-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MOCK_ROLE_COOKIE } from "@/lib/dashboard/config";

export interface LDCUserMenuProps {
  name: string;
  email: string;
  /** Página de perfil; sin ella, «Perfil» queda deshabilitado */
  profileHref?: string;
}

export function LDCUserMenu({ name, email, profileHref }: LDCUserMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // Simulación de roles (solo dev): sin esto, el rol simulado seguiría activo.
    document.cookie = `${MOCK_ROLE_COOKIE}=; Max-Age=0; path=/`;
    router.replace("/dashboard/login");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <LDCAvatar name={name} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              </div>
              <ChevronUp className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="min-w-56 rounded-lg"
            sideOffset={4}
          >
            {profileHref ? (
              <DropdownMenuItem asChild>
                <Link href={profileHref}>
                  <User className="size-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <User className="size-4" />
                Perfil
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
