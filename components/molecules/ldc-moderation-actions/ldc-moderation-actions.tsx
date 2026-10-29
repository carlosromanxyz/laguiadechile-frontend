"use client";

import { Check, Loader2, X } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
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
import type { IDashboardActionResult, IDashboardModerationKind } from "@/interfaces/dashboard";

export interface LDCModerationActionsProps {
  kind: IDashboardModerationKind;
  id: string;
  slug: string;
  /** Título del elemento, para los mensajes y el nombre accesible */
  title: string;
  /** Server action que lo publica */
  onApprove: (kind: IDashboardModerationKind, id: string, slug: string) => Promise<IDashboardActionResult>;
  /** Server action que lo rechaza, con motivo opcional */
  onReject: (
    kind: IDashboardModerationKind,
    id: string,
    slug: string,
    reason?: string,
  ) => Promise<IDashboardActionResult>;
}

/**
 * LDCModerationActions - Aprobar o rechazar un elemento de la cola de moderación
 *
 * «Aprobar» llama a la server action directo; «Rechazar» pide confirmación con un motivo
 * opcional. El resultado se avisa con un toast y la página se refresca desde la acción
 * (`revalidatePath`).
 *
 * @example
 * <LDCModerationActions kind="listing" id={id} slug={slug} title={title}
 *   onApprove={approveModerationAction} onReject={rejectModerationAction} />
 */
export function LDCModerationActions({
  kind,
  id,
  slug,
  title,
  onApprove,
  onReject,
}: LDCModerationActionsProps) {
  const reasonId = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const [pendingVerb, setPendingVerb] = useState<"approve" | "reject" | null>(null);

  function run(verb: "approve" | "reject") {
    setPendingVerb(verb);
    startTransition(async () => {
      const result =
        verb === "approve" ? await onApprove(kind, id, slug) : await onReject(kind, id, slug, reason);
      if (result.ok) {
        toast.success(verb === "approve" ? `Publicaste «${title}»` : `Rechazaste «${title}»`);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
      setPendingVerb(null);
    });
  }

  return (
    <>
      <Button size="sm" onClick={() => run("approve")} disabled={pending} aria-label={`Aprobar «${title}»`}>
        {pendingVerb === "approve" ? <Loader2 className="animate-spin" /> : <Check />}
        Aprobar
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={pending}
        aria-label={`Rechazar «${title}»`}
      >
        <X />
        Rechazar
      </Button>

      <AlertDialog open={open} onOpenChange={(v) => !pending && setOpen(v)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Rechazar «{title}»?</AlertDialogTitle>
            <AlertDialogDescription>
              No se publicará en La Guía. Su dueño podrá editarlo y volver a enviarlo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <Label htmlFor={reasonId}>Motivo (opcional)</Label>
            <Textarea
              id={reasonId}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={() => run("reject")} disabled={pending}>
              {pendingVerb === "reject" && <Loader2 className="animate-spin" />}
              Rechazar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
