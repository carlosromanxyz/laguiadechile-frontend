"use client";

import { ChevronUp, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LDCAvatar } from "@/components/atoms/ldc-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { markFavoritesSignedOut } from "@/hooks/use-favorite-ids";

export interface LDCUserMenuProps {
  name: string;
  email: string;
  /**
   * Roles de la cuenta en una línea («Avisador · Comercio · Administrador»). Si viene, va bajo el
   * nombre y el email pasa al desplegable; si no, bajo el nombre va el email.
   */
  roleLine?: string;
  /** Página de perfil; sin ella, «Perfil» queda deshabilitado */
  profileHref?: string;
}

/**
 * LDCUserMenu - Menú de la cuenta al pie del sidebar
 *
 * Avatar, nombre y la línea de roles (o el email) en el botón; el desplegable lleva el email si
 * no se vio, «Perfil» y «Cerrar sesión».
 */
export function LDCUserMenu({ name, email, roleLine, profileHref }: LDCUserMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // La próxima sesión en esta pestaña no hereda los favoritos cacheados (`useFavoriteIds`).
    markFavoritesSignedOut();
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
                <span className="truncate text-xs text-muted-foreground">{roleLine ?? email}</span>
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
            {roleLine && (
              <>
                <DropdownMenuLabel className="truncate font-open-sans text-xs font-normal text-muted-foreground">
                  {email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
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
