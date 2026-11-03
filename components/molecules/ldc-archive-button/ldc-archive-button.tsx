"use client";

import { Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { IDashboardActionResult, IDashboardModerationKind } from "@/interfaces/dashboard";

/** Server action de archivar o desarchivar (`archive-actions.ts` del panel). */
export type LDCArchiveActionFn = (
  kind: IDashboardModerationKind,
  id: string,
  slug: string,
) => Promise<IDashboardActionResult>;

export interface LDCArchiveTarget {
  /** Ficha (comercio o servicio), aviso o evento */
  kind: IDashboardModerationKind;
  id: string;
  /** Slug público (para refrescar su página) */
  slug: string;
  /** Título (confirmación, toast y nombre accesible) */
  title: string;
  /** Si hoy está archivada: el botón desarchiva */
  archived: boolean;
  onArchive: LDCArchiveActionFn;
  onUnarchive: LDCArchiveActionFn;
}

/** «Ficha» es femenino; «aviso» y «evento», masculinos. */
const pronoun = (kind: IDashboardModerationKind) => (kind === "listing" ? "la" : "lo");

/** Destino estable del foco: el `<main id="contenido" tabIndex={-1}>` del layout del panel. */
function focusStable() {
  document.getElementById("contenido")?.focus();
}

/** Si el elemento sigue en la página, lo enfoca; si no (su fila salió de la lista), va a `focusStable`. */
function focusOr(el: HTMLElement | null) {
  if (el?.isConnected) el.focus();
  else focusStable();
}

/**
 * Tras desarchivar (sin diálogo) el foco se pierde: el botón queda `disabled` mientras corre la
 * acción y, si la fila sale de la lista (filtro «Archivados»), se desmonta con ella. Como el
 * componente puede ya no existir, se vigila con un temporizador (hasta ~1,5 s): si el botón sigue en
 * la página y se habilitó, vuelve a él; si salió, a `main#contenido`. Si el usuario movió el foco a
 * otra parte, no se toca.
 */
function refocusAfterAction(el: HTMLElement | null, tries = 15) {
  const active = document.activeElement;
  if (active && active !== document.body) return;
  if (!el || !el.isConnected) return focusStable();
  if (!el.matches(":disabled")) return el.focus();
  if (tries > 0) window.setTimeout(() => refocusAfterAction(el, tries - 1), 100);
}

/**
 * Estado y flujo de archivar/desarchivar: archivar pide confirmación (`request` abre el diálogo y
 * `confirm` llama a la acción); desarchivar se hace directo. Avisa con un toast; la lista se
 * refresca desde la server action. Si la fila sale de la lista (p. ej. en un filtro por estado),
 * el foco va a un lugar estable (`main#contenido`) en vez de perderse en el `<body>`. Sin
 * `target` (una fila sin archivar), no hace nada.
 */
export function useLDCArchiveToggle(target: LDCArchiveTarget | undefined) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const archived = target?.archived ?? false;
  /** Quién abrió la confirmación (o pidió desarchivar): ahí vuelve el foco si sigue en la página. */
  const openerRef = useRef<HTMLElement | null>(null);

  function run(archive: boolean) {
    if (!target) return;
    const { kind, id, slug, title, onArchive, onUnarchive } = target;
    startTransition(async () => {
      const result = await (archive ? onArchive : onUnarchive)(kind, id, slug);
      if (result.ok) {
        toast.success(archive ? `Archivaste «${title}»` : `Desarchivaste «${title}»: volvió a revisión`);
        setOpen(false);
        // Archivar cierra el diálogo y lo resuelve `restoreFocus`; desarchivar no tiene diálogo.
        if (!archive) refocusAfterAction(openerRef.current);
      } else {
        toast.error(result.message);
      }
    });
  }

  return {
    open,
    setOpen,
    pending,
    /** Archivar: abre la confirmación; desarchivar: lo hace directo. */
    /** `opener`: dónde volver el foco (por defecto, el elemento enfocado; el menú ⋯ pasa su disparador). */
    request: (opener?: HTMLElement | null) => {
      openerRef.current =
        opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      if (archived) run(false);
      else setOpen(true);
    },
    /** Al cerrar el diálogo: vuelve a quien lo abrió o, si su fila ya no está, a `main#contenido`. */
    restoreFocus: () => focusOr(openerRef.current),
    confirm: () => run(true),
  };
}

export interface LDCArchiveConfirmDialogProps {
  kind: IDashboardModerationKind;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  onConfirm: () => void;
  /** Dónde dejar el foco al cerrar (por defecto, lo que haga Radix: volver al disparador) */
  onRestoreFocus?: () => void;
}

/** Confirmación de archivar (`AlertDialog`); «Cancelar» cierra sin archivar. */
export function LDCArchiveConfirmDialog({
  kind,
  title,
  open,
  onOpenChange,
  pending,
  onConfirm,
  onRestoreFocus,
}: LDCArchiveConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent
        onCloseAutoFocus={
          onRestoreFocus
            ? (e) => {
                e.preventDefault();
                onRestoreFocus();
              }
            : undefined
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>¿Archivar «{title}»?</AlertDialogTitle>
          <AlertDialogDescription>
            Dejará de verse en La Guía. Puedes desarchivar{pronoun(kind)} cuando quieras; volverá a
            revisión.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              // Queda abierto hasta que responda la acción.
              e.preventDefault();
              onConfirm();
            }}
            disabled={pending}
            aria-busy={pending || undefined}
          >
            {pending ? <Loader2 className="animate-spin" /> : <Archive />}
            Archivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export interface LDCArchiveButtonProps extends LDCArchiveTarget {
  className?: string;
}

/**
 * LDCArchiveButton - «Archivar» / «Desarchivar» de una publicación propia (CLGDC-159)
 *
 * Botón `ghost` `size="sm"` para las acciones de `LDCDashboardListItem` («Mis avisos», tarjetas del
 * inicio). Archivar confirma con `LDCArchiveConfirmDialog`; desarchivar no confirma (vuelve a
 * revisión, nada se pierde). El menú `⋯` de `LDCResourceRowActions` usa el mismo flujo.
 *
 * @example
 * <LDCArchiveButton kind="classified" id={c.id} slug={c.slug} title={c.title} archived={false}
 *   onArchive={archiveMyPublicationAction} onUnarchive={unarchiveMyPublicationAction} />
 */
export function LDCArchiveButton({ className, ...target }: LDCArchiveButtonProps) {
  const { open, setOpen, pending, request, confirm, restoreFocus } = useLDCArchiveToggle(target);
  const label = target.archived ? "Desarchivar" : "Archivar";

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={className}
        onClick={() => request()}
        disabled={pending}
        aria-label={`${label} «${target.title}»`}
      >
        {pending && !open ? (
          <Loader2 className="animate-spin" />
        ) : target.archived ? (
          <ArchiveRestore />
        ) : (
          <Archive />
        )}
        {label}
      </Button>
      <LDCArchiveConfirmDialog
        kind={target.kind}
        title={target.title}
        open={open}
        onOpenChange={setOpen}
        pending={pending}
        onConfirm={confirm}
        onRestoreFocus={restoreFocus}
      />
    </>
  );
}
