"use client";

import { Loader2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Largo máximo del motivo (el `MaxLength(500)` del backend). */
const REASON_MAX = 500;

export interface LDCRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Título del diálogo («¿Rechazar «…»?») */
  title: ReactNode;
  /** Qué pasa al rechazar */
  description: ReactNode;
  /** Mientras la acción corre: no se cierra y «Rechazar» muestra el spinner */
  pending?: boolean;
  /** Confirma con el motivo ya recortado (nunca vacío) */
  onConfirm: (reason: string) => void;
}

/**
 * LDCRejectDialog - Diálogo controlado para rechazar una publicación con su motivo
 *
 * El motivo es obligatorio (lo exige el backend y lo lee el dueño): «Rechazar» queda deshabilitado
 * mientras el texto esté vacío o tenga solo espacios. Hasta 500 caracteres. Mientras `pending`, el
 * diálogo no se cierra. El texto escrito se conserva entre aperturas. Lo usan `LDCModerationActions`
 * y `LDCPublicationStatusActions`.
 *
 * @example
 * <LDCRejectDialog open={open} onOpenChange={setOpen} title={`¿Rechazar «${title}»?`}
 *   description="No se publicará en La Guía." pending={pending} onConfirm={(r) => reject(r)} />
 */
export function LDCRejectDialog({
  open,
  onOpenChange,
  title,
  description,
  pending = false,
  onConfirm,
}: LDCRejectDialogProps) {
  const reasonId = useId();
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();

  return (
    <AlertDialog open={open} onOpenChange={(v) => !pending && onOpenChange(v)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor={reasonId}>Motivo del rechazo (obligatorio)</Label>
          <Textarea
            id={reasonId}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={REASON_MAX}
            rows={3}
            required
            aria-required
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={() => onConfirm(trimmed)} disabled={pending || !trimmed}>
            {pending && <Loader2 className="animate-spin" />}
            Rechazar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
