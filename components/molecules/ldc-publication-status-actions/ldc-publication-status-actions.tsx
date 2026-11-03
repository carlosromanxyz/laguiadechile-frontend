"use client";

import { ExternalLink, Loader2, MoreHorizontal, Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { LDCModerationActions } from "@/components/molecules/ldc-moderation-actions";
import { LDCRejectDialog } from "@/components/molecules/ldc-reject-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ADMIN_SETTABLE_STATUSES,
  type IAdminPublicationStatus,
} from "@/interfaces/admin-publication";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { ADMIN_PUBLICATION_STATUS_META } from "@/lib/dashboard/admin-publication-status";
import { cn } from "@/lib/utils";

export interface LDCPublicationStatusActionsProps {
  id: string;
  slug: string;
  /** Título de la publicación (mensajes y nombres accesibles) */
  title: string;
  status: IAdminPublicationStatus;
  /** Server action que cambia el estado; con `REJECTED` recibe el motivo (obligatorio) */
  onSetStatus: (
    id: string,
    slug: string,
    status: IAdminPublicationStatus,
    reason?: string,
  ) => Promise<IDashboardActionResult>;
  /** Formulario de edición; sin él, «Editar» se muestra deshabilitado */
  editHref?: string;
  /** Página pública; «Ver en el sitio» solo se habilita con `PUBLISHED` */
  publicHref?: string;
  className?: string;
}

/** Objetivos táctiles: 44 px bajo `md`, 32 px desde `md`. */
const TARGET = "h-11 md:h-8";

const canChangeStatus = (s: IAdminPublicationStatus) => s !== "ARCHIVED";

/** Texto del toast según el cambio. */
function successMessage(from: IAdminPublicationStatus, to: IAdminPublicationStatus, title: string) {
  const verb =
    to === "PUBLISHED"
      ? from === "REVIEW"
        ? "Aprobaste"
        : from === "EXPIRED"
          ? "Republicaste"
          : "Publicaste"
      : to === "REVIEW"
        ? "Pasaste a revisión"
        : to === "REJECTED"
          ? "Rechazaste"
          : to === "EXPIRED"
            ? "Marcaste como vencida"
            : "Archivaste";
  return `${verb} «${title}»`;
}

/**
 * LDCPublicationStatusActions - Acciones de estado de una fila del listado admin (alternativa B de CLGDC-114)
 *
 * A la vista, la acción que pide el estado: En revisión → Aprobar / Rechazar (`LDCModerationActions`,
 * con motivo obligatorio); Publicada o Rechazada → Editar; Vencida → Republicar. Siempre cierra con
 * `⋯`: «Cambiar estado» (`DropdownMenuRadioGroup`; «Rechazada…» abre el diálogo del motivo), Editar y
 * Ver en el sitio. Archivada (la archivó su dueño, CLGDC-157): sin acción de estado, solo `⋯` con
 * Editar y Ver en el sitio. Objetivos de 44 px bajo `md` y 32 px desde `md`; todo alineado a la derecha.
 *
 * @example
 * <LDCPublicationStatusActions id={l.id} slug={l.slug} title={l.title} status="REVIEW"
 *   publicHref={`/comercio/${l.slug}`} onSetStatus={setAdminListingStatusAction} />
 */
export function LDCPublicationStatusActions({
  id,
  slug,
  title,
  status,
  onSetStatus,
  editHref,
  publicHref,
  className,
}: LDCPublicationStatusActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [pendingTo, setPendingTo] = useState<IAdminPublicationStatus | null>(null);

  function change(to: IAdminPublicationStatus, rejection?: string) {
    if (to === status) return;
    setPendingTo(to);
    startTransition(async () => {
      const result = await onSetStatus(id, slug, to, rejection);
      if (result.ok) {
        toast.success(successMessage(status, to, title));
        setRejectOpen(false);
      } else {
        toast.error(result.message);
      }
      setPendingTo(null);
    });
  }

  function onMenuChange(value: string) {
    const to = value as IAdminPublicationStatus;
    if (to === status || !canChangeStatus(status)) return;
    if (to === "REJECTED") setRejectOpen(true);
    else change(to);
  }

  const canView = status === "PUBLISHED" && Boolean(publicHref);
  // Una ficha archivada no cambia de estado desde el panel (la API responde 409).
  const canChange = canChangeStatus(status);
  const editLabel = editHref ? `Editar «${title}»` : `Editar «${title}» (aún no disponible)`;

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-end gap-2",
        className,
      )}
    >
      {status === "REVIEW" && (
        <LDCModerationActions
          kind="listing"
          id={id}
          slug={slug}
          title={title}
          buttonClassName={TARGET}
          onApprove={(_kind, itemId, itemSlug) => onSetStatus(itemId, itemSlug, "PUBLISHED")}
          onReject={(_kind, itemId, itemSlug, why) => onSetStatus(itemId, itemSlug, "REJECTED", why)}
        />
      )}
      {status === "EXPIRED" && (
        <Button
          size="sm"
          variant="outline"
          className={TARGET}
          onClick={() => change("PUBLISHED")}
          disabled={pending}
          aria-label={`Republicar «${title}»`}
        >
          {pendingTo === "PUBLISHED" ? <Loader2 className="animate-spin" /> : <RotateCcw />}
          Republicar
        </Button>
      )}
      {(status === "PUBLISHED" || status === "REJECTED") &&
        (editHref ? (
          <Button asChild size="sm" variant="outline" className={TARGET}>
            <Link href={editHref} aria-label={editLabel}>
              <Pencil />
              Editar
            </Link>
          </Button>
        ) : (
          // Formularios de ficha del panel: pendientes de lienzo (sección 2 de D3).
          <Button size="sm" variant="outline" className={TARGET} disabled aria-label={editLabel}>
            <Pencil />
            Editar
          </Button>
        ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-11 md:size-8"
            disabled={pending}
            aria-label={`Más acciones para «${title}»`}
          >
            {pending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {canChange && (
            <>
              <DropdownMenuLabel className="grid">
                Cambiar estado
                <span className="truncate text-xs font-normal text-muted-foreground">{title}</span>
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={status} onValueChange={onMenuChange}>
                {ADMIN_SETTABLE_STATUSES.map((s) => (
                  <DropdownMenuRadioItem key={s} value={s}>
                    {s === "PUBLISHED" && status === "REVIEW"
                      ? "Publicada (aprobar)"
                      : s === "REJECTED"
                        ? "Rechazada…"
                        : ADMIN_PUBLICATION_STATUS_META[s].label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
            </>
          )}
          {editHref ? (
            <DropdownMenuItem asChild>
              <Link href={editHref}>
                <Pencil />
                Editar
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <Pencil />
              Editar
            </DropdownMenuItem>
          )}
          {canView && publicHref ? (
            <DropdownMenuItem asChild>
              <Link href={publicHref}>
                <ExternalLink />
                Ver en el sitio
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <ExternalLink />
              Ver en el sitio
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rechazo desde «Cambiar estado» (desde En revisión, el de LDCModerationActions). */}
      <LDCRejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={`¿Rechazar «${title}»?`}
        description="Dejará de verse en La Guía. Su dueño verá el motivo y podrá corregirla y volver a enviarla."
        pending={pendingTo === "REJECTED"}
        onConfirm={(reason) => change("REJECTED", reason)}
      />
    </div>
  );
}
