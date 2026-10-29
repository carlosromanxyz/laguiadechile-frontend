"use client";

import { Info, Pencil } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { Button } from "@/components/ui/button";
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

export interface LDCRejectionReasonDialogProps {
  /** Título de la publicación rechazada (va en el modal y en el nombre accesible del badge) */
  title: string;
  /** Motivo que escribió el equipo: se muestra como texto plano, nunca como HTML */
  reason: string;
  /** Destino de «Corregir y reenviar» (el formulario de la publicación) */
  fixHref: string;
  /** Texto del badge (por defecto «Rechazado») */
  badgeLabel?: string;
}

/**
 * LDCRejectionReasonDialog - Badge «Rechazado» que abre el motivo del rechazo
 *
 * El badge `status-rejected` es el botón que abre un `ui/dialog` (`aria-haspopup="dialog"`, con un
 * nombre accesible que conserva el texto visible: «Rechazado: ver motivo del rechazo de «…»»). El
 * modal trae el título de la publicación, el motivo como texto (React lo escapa; los saltos de
 * línea se respetan), el CTA «Corregir y reenviar» y «Cerrar». Lo usa «Mis avisos»; sirve igual
 * para fichas.
 *
 * @example
 * <LDCRejectionReasonDialog title="Casa 3D 2B" reason="La foto no muestra la casa." fixHref="/dashboard/avisos/123" />
 */
export function LDCRejectionReasonDialog({
  title,
  reason,
  fixHref,
  badgeLabel = "Rechazado",
}: LDCRejectionReasonDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={`${badgeLabel}: ver motivo del rechazo de «${title}»`}
          className="cursor-pointer rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <LDCBadge variant="status-rejected">
            {badgeLabel}
            <Info className="size-3" aria-hidden />
          </LDCBadge>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-extrabold">Motivo del rechazo</DialogTitle>
          <DialogDescription className="font-open-sans">«{title}»</DialogDescription>
        </DialogHeader>
        <p className="font-open-sans text-sm whitespace-pre-line">{reason}</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
          <LDCButton href={fixHref}>
            <Pencil />
            Corregir y reenviar
          </LDCButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
