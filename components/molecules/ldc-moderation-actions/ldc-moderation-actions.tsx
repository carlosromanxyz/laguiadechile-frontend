"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { LDCRejectDialog } from "@/components/molecules/ldc-reject-dialog";
import { Button } from "@/components/ui/button";
import type { IDashboardActionResult, IDashboardModerationKind } from "@/interfaces/dashboard";

export interface LDCModerationActionsProps {
  kind: IDashboardModerationKind;
  id: string;
  slug: string;
  /** Título del elemento, para los mensajes y el nombre accesible */
  title: string;
  /** Server action que lo publica */
  onApprove: (kind: IDashboardModerationKind, id: string, slug: string) => Promise<IDashboardActionResult>;
  /** Server action que lo rechaza, con el motivo (obligatorio: lo lee el dueño) */
  onReject: (
    kind: IDashboardModerationKind,
    id: string,
    slug: string,
    reason?: string,
  ) => Promise<IDashboardActionResult>;
  /** Clases extra de los dos botones (p. ej. `h-11 md:h-8` para objetivos táctiles) */
  buttonClassName?: string;
}

/**
 * LDCModerationActions - Aprobar o rechazar un elemento de la cola de moderación
 *
 * «Aprobar» llama a la server action directo; «Rechazar» pide confirmación con un motivo
 * obligatorio en `LDCRejectDialog` (el backend lo exige al rechazar; sin texto no se puede enviar).
 * El resultado se avisa con un toast y la página se refresca desde la acción (`revalidatePath`).
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
  buttonClassName,
}: LDCModerationActionsProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [pendingVerb, setPendingVerb] = useState<"approve" | "reject" | null>(null);

  function run(verb: "approve" | "reject", reason?: string) {
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
      <Button
        size="sm"
        className={buttonClassName}
        onClick={() => run("approve")}
        disabled={pending}
        aria-label={`Aprobar «${title}»`}
      >
        {pendingVerb === "approve" ? <Loader2 className="animate-spin" /> : <Check />}
        Aprobar
      </Button>
      <Button
        size="sm"
        variant="outline"
        className={buttonClassName}
        onClick={() => setOpen(true)}
        disabled={pending}
        aria-label={`Rechazar «${title}»`}
      >
        <X />
        Rechazar
      </Button>

      <LDCRejectDialog
        open={open}
        onOpenChange={setOpen}
        title={`¿Rechazar «${title}»?`}
        description="No se publicará en La Guía. Su dueño podrá editarlo y volver a enviarlo."
        pending={pendingVerb === "reject"}
        onConfirm={(reason) => run("reject", reason)}
      />
    </>
  );
}
