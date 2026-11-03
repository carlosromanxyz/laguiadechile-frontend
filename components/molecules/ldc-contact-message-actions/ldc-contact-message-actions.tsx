"use client";

import { Eye, Loader2, Mail, MailCheck, MailOpen, MoreHorizontal, Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IContactMessage } from "@/interfaces/contact-message";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { isValidContactEmail } from "@/lib/contact/limits";
import { CONTACT_READ_META } from "@/lib/dashboard/contact-message-status";
import { formatShortDate } from "@/lib/dashboard/dates";
import { cn } from "@/lib/utils";

export interface LDCContactMessageActionsProps {
  /** Mensaje de la fila: `name`, `email`, `subject` y `message` se pintan solo como texto */
  message: IContactMessage;
  /**
   * Server action que marca leído (`true`) o no leído (`false`); con `revalidate: false` no refresca
   * el panel (la lectura automática al abrir, que refresca al cerrar el diálogo)
   */
  onSetRead: (id: string, read: boolean, revalidate?: boolean) => Promise<IDashboardActionResult>;
  className?: string;
}

/** Objetivos táctiles: 44 px bajo `md`, 32 px desde `md`. */
const TARGET = "h-11 md:h-8";

/**
 * `mailto:` solo con un correo que pasa `isValidContactEmail` (sin `? & = % # /`); dirección y
 * asunto van codificados. Si no pasa, no hay enlace.
 */
function replyHref(m: IContactMessage): string | null {
  if (!isValidContactEmail(m.email)) return null;
  return `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`;
}

/**
 * LDCContactMessageActions - Acciones de una fila de la bandeja «Mensajes» (alternativa B de CLGDC-114)
 *
 * A la vista: «Ver» (abre el mensaje en un `ui/dialog`) y, si no está leído, «Marcar leído». Cierra
 * con `⋯`: Ver mensaje, Marcar como leído / no leído y Responder por correo (`mailto:` armado solo
 * con el correo validado). El diálogo trae asunto, remitente, fecha y el mensaje como texto (React
 * lo escapa; los saltos de línea se respetan), y en el pie Marcar leído / no leído y Responder.
 * Abrir un mensaje no leído lo marca leído al momento (optimista): la server action va sin
 * revalidar, así la fila no desaparece con el filtro «No leídos» mientras se lee, y el panel se
 * refresca al cerrar. Si falla, vuelve a «No leído» con un toast y el diálogo sigue abierto.
 * Objetivos de 44 px bajo `md` y 32 px desde `md`; todo alineado a la derecha.
 *
 * @example
 * <LDCContactMessageActions message={m} onSetRead={setContactMessageReadAction} />
 */
export function LDCContactMessageActions({ message, onSetRead, className }: LDCContactMessageActionsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // Lectura automática al abrir: `true` mientras el servidor aún no refleja el cambio.
  const [autoRead, setAutoRead] = useState(false);
  const [refreshOnClose, setRefreshOnClose] = useState(false);
  const openRef = useRef(false);
  const read = message.readAt !== null || autoRead;
  const reply = replyHref(message);
  const meta = CONTACT_READ_META[read ? "read" : "unread"];

  function openMessage() {
    openRef.current = true;
    setOpen(true);
    if (read) return;
    setAutoRead(true);
    onSetRead(message.id, true, false).then(
      (result) => {
        if (result.ok) {
          // Si ya se cerró el diálogo, se refresca ahora; si no, al cerrarlo.
          if (openRef.current) setRefreshOnClose(true);
          else router.refresh();
        } else {
          setAutoRead(false);
          toast.error(result.message);
        }
      },
      () => {
        setAutoRead(false);
        toast.error("No pudimos marcar el mensaje como leído");
      },
    );
  }

  function onOpenChange(next: boolean) {
    openRef.current = next;
    setOpen(next);
    if (!next && refreshOnClose) {
      setRefreshOnClose(false);
      router.refresh();
    }
  }

  function setRead(next: boolean) {
    setAutoRead(false);
    setRefreshOnClose(false);
    startTransition(async () => {
      const result = await onSetRead(message.id, next);
      if (result.ok) {
        toast.success(
          next
            ? `Marcaste como leído «${message.subject}»`
            : `Marcaste como no leído «${message.subject}»`,
        );
      } else {
        toast.error(result.message);
      }
    });
  }

  const toggleLabel = read ? "Marcar como no leído" : "Marcar como leído";
  const ToggleIcon = read ? Mail : MailCheck;

  return (
    <div className={cn("flex w-full flex-wrap items-center justify-end gap-2", className)}>
      <Button
        size="sm"
        variant="outline"
        className={TARGET}
        onClick={openMessage}
        aria-haspopup="dialog"
        aria-label={`Ver el mensaje «${message.subject}»`}
      >
        <Eye />
        Ver
      </Button>
      {!read && (
        <Button
          size="sm"
          variant="outline"
          className={TARGET}
          onClick={() => setRead(true)}
          disabled={pending}
          aria-label={`Marcar como leído «${message.subject}»`}
        >
          {pending ? <Loader2 className="animate-spin" /> : <MailCheck />}
          Marcar leído
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-11 md:size-8"
            disabled={pending}
            aria-label={`Más acciones para «${message.subject}»`}
          >
            {pending && read ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={openMessage}>
            <MailOpen />
            Ver mensaje
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRead(!read)}>
            <ToggleIcon />
            {toggleLabel}
          </DropdownMenuItem>
          {reply && (
            <DropdownMenuItem asChild>
              <a href={reply}>
                <Reply />
                Responder por correo
              </a>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex">
              <LDCBadge variant={meta.badge}>{meta.label}</LDCBadge>
            </div>
            <DialogTitle className="font-extrabold break-words">{message.subject}</DialogTitle>
            <DialogDescription className="font-open-sans break-words">
              {message.name} · {message.email} ·{" "}
              <time dateTime={message.createdAt}>{formatShortDate(message.createdAt)}</time>
            </DialogDescription>
          </DialogHeader>
          <p className="max-h-[50vh] overflow-y-auto font-open-sans text-sm break-words whitespace-pre-line">
            {message.message}
          </p>
          {message.mailError && (
            <p className="font-open-sans text-xs text-muted-foreground">
              Este mensaje no se reenvió por correo: respóndelo desde aquí.
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
            <Button variant="outline" onClick={() => setRead(!read)} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <ToggleIcon />}
              {toggleLabel}
            </Button>
            {reply && (
              <Button asChild>
                <a href={reply}>
                  <Reply />
                  Responder
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
