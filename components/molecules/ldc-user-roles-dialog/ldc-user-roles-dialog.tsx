"use client";

import { Loader2, Pencil } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { LDC_ROLE_ICONS } from "@/components/atoms/ldc-role-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { LDC_ROLE_KEYS, LDC_ROLE_META, type LDCRole } from "@/lib/auth/roles";

export interface LDCUserRolesDialogProps {
  /**
   * Nombre visible de la cuenta, ya armado con `formatPersonName` (título del diálogo, toast y
   * nombre accesible del botón)
   */
  name: string;
  email: string;
  /** Roles actuales */
  roles: readonly LDCRole[];
  /** Es la cuenta de quien está en el panel: no puede quitarse «Administrador» */
  isSelf?: boolean;
  /** Server action que guarda la lista completa de roles */
  onSave: (roles: LDCRole[]) => Promise<IDashboardActionResult>;
  /** Clases del botón que abre el diálogo */
  buttonClassName?: string;
}

/** Por qué una casilla no se puede cambiar (texto bajo su etiqueta). */
function lockReason(role: LDCRole, isSelf: boolean): string | null {
  if (role === "usuario") return "Toda cuenta lo tiene.";
  if (role === "admin" && isSelf) return "No puedes quitarte este rol a ti mismo.";
  return null;
}

/**
 * LDCUserRolesDialog - Botón «Editar roles» y su diálogo con una casilla por rol (CLGDC-127)
 *
 * Una casilla por rol de `LDC_ROLE_KEYS` con su ícono y nombre (`LDC_ROLE_META`). «Usuario» va
 * siempre marcada y bloqueada (la API lo suma a toda cuenta). En la cuenta propia, «Administrador»
 * también queda bloqueada: el backend responde 400 si un admin se quita ADMIN, así nadie se deja
 * fuera del panel por un clic. Al abrir parte de los roles actuales; «Guardar» solo se habilita si
 * algo cambió y, mientras guarda, el diálogo no se cierra. Éxito o error, con un toast.
 *
 * @example
 * <LDCUserRolesDialog name="Ana Pérez" email="ana@correo.cl" roles={["usuario", "comercio"]}
 *   onSave={(roles) => setAdminUserRolesAction(id, roles)} />
 */
export function LDCUserRolesDialog({
  name,
  email,
  roles,
  isSelf = false,
  onSave,
  buttonClassName,
}: LDCUserRolesDialogProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LDCRole[]>([...roles]);
  const [pending, startTransition] = useTransition();

  const changed =
    selected.length !== roles.length || selected.some((r) => !roles.includes(r));

  function onOpenChange(next: boolean) {
    if (pending) return;
    if (next) setSelected([...roles]);
    setOpen(next);
  }

  function toggle(role: LDCRole, checked: boolean) {
    setSelected((prev) =>
      checked ? LDC_ROLE_KEYS.filter((r) => r === role || prev.includes(r)) : prev.filter((r) => r !== role),
    );
  }

  function save() {
    startTransition(async () => {
      const result = await onSave(selected);
      if (result.ok) {
        toast.success(`Guardaste los roles de «${name}»`);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={buttonClassName}
          aria-label={`Editar roles de «${name}»`}
        >
          <Pencil />
          Editar roles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-extrabold">Roles de «{name}»</DialogTitle>
          <DialogDescription className="font-open-sans">{email}</DialogDescription>
        </DialogHeader>
        <fieldset className="grid gap-4" disabled={pending}>
          <legend className="sr-only">Roles de la cuenta</legend>
          {LDC_ROLE_KEYS.map((role) => {
            const meta = LDC_ROLE_META[role];
            const Icon = LDC_ROLE_ICONS[meta.iconName];
            const id = `${baseId}-${role}`;
            const hintId = `${id}-hint`;
            const locked = lockReason(role, isSelf);
            return (
              <div key={role} className="flex items-start gap-3">
                <Checkbox
                  id={id}
                  checked={selected.includes(role) || role === "usuario"}
                  onCheckedChange={(checked) => toggle(role, checked === true)}
                  disabled={pending || locked !== null}
                  aria-describedby={locked ? hintId : undefined}
                  className="relative mt-0.5 border-muted-foreground after:absolute after:-inset-3 after:content-['']"
                />
                <div className="grid gap-0.5">
                  <Label htmlFor={id} className="w-auto gap-1.5 leading-snug font-normal text-foreground">
                    <Icon className="size-3.5" aria-hidden />
                    {meta.label}
                  </Label>
                  {locked && (
                    <p id={hintId} className="font-open-sans text-xs text-muted-foreground">
                      {locked}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </fieldset>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={save} disabled={pending || !changed}>
            {pending && <Loader2 className="animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
