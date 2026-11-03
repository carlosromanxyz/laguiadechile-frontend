"use client";

import { Archive, ArchiveRestore, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  LDCArchiveConfirmDialog,
  type LDCArchiveTarget,
  useLDCArchiveToggle,
} from "@/components/molecules/ldc-archive-button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface LDCResourceRowActionsProps {
  editHref?: string;
  onDelete?: () => Promise<{ status: string } | void>;
  deleteLabel?: string;
  /**
   * «Archivar» / «Desarchivar» en el menú (publicaciones propias, CLGDC-159): archivar confirma con
   * `LDCArchiveConfirmDialog`; desarchivar va directo. Las acciones son server actions.
   */
  archive?: LDCArchiveTarget;
}

export function LDCResourceRowActions({
  editHref,
  onDelete,
  deleteLabel = "¿Eliminar este registro?",
  archive,
}: LDCResourceRowActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const archiving = useLDCArchiveToggle(archive);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleConfirm() {
    if (!onDelete) return;
    startTransition(async () => {
      try {
        await onDelete();
        toast.success("Registro eliminado");
        setOpen(false);
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={archiving.pending}
          >
            {archiving.pending && !archiving.open ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreHorizontal className="size-4" />
            )}
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {editHref && (
            <DropdownMenuItem asChild>
              <Link href={editHref}>
                <Pencil className="size-4" />
                Editar
              </Link>
            </DropdownMenuItem>
          )}
          {archive && (
            <DropdownMenuItem
              // El menú se cierra y, al cerrar la confirmación, el foco vuelve a `⋯` (o a
              // `main#contenido` si la fila ya no está).
              onSelect={() => archiving.request(triggerRef.current)}
            >
              {archive.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
              {archive.archived ? "Desarchivar" : "Archivar"}
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOpen(true); }}>
              <Trash2 className="size-4" />
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteLabel}</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {archive && (
        <LDCArchiveConfirmDialog
          kind={archive.kind}
          title={archive.title}
          open={archiving.open}
          onOpenChange={archiving.setOpen}
          pending={archiving.pending}
          onConfirm={archiving.confirm}
          onRestoreFocus={archiving.restoreFocus}
        />
      )}
    </>
  );
}
