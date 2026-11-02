"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, Ellipsis, Link as LinkIcon, Mail, Share2, X } from "lucide-react";
import { FaFacebook, FaLinkedin, FaTelegram, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { LDCShareOption } from "@/components/atoms/ldc-share-option";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";

interface LDCSocialShareButtonsProps {
  /** Título de lo que se comparte */
  title: string;
  /** Clase extra para el contenedor */
  className?: string;
  /** `light` para fondos oscuros, `dark` para fondos claros */
  variant?: "light" | "dark";
}

type CopyState = "idle" | "copied" | "error";

const COPY_RESET_MS = 2000;

/** Opciones que son enlaces: redes (pestaña nueva) y correo (`mailto:`). */
function buildLinks(title: string, url: string) {
  const e = encodeURIComponent;
  const message = `Descubre ${title} en La Guía de Chile`;
  return {
    networks: [
      { label: "WhatsApp", icon: FaWhatsapp, href: `https://wa.me/?text=${e(`${message} ${url}`)}` },
      { label: "Facebook", icon: FaFacebook, href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
      { label: "X", icon: FaXTwitter, href: `https://x.com/intent/post?text=${e(message)}&url=${e(url)}` },
      { label: "LinkedIn", icon: FaLinkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}` },
      { label: "Telegram", icon: FaTelegram, href: `https://t.me/share/url?url=${e(url)}&text=${e(message)}` },
    ],
    mail: `mailto:?subject=${e(`${title} - La Guía de Chile`)}&body=${e(`${message}\n${url}`)}`,
    message,
  };
}

/**
 * LDCSocialShareButtons - Botón «Compartir» con menú de redes, correo y copiar enlace
 *
 * Escritorio (≥ 768 px): popover anclado al botón (`ui/popover`), filas `LDCShareOption` `row`.
 * Móvil (< 768 px, `useIsMobile`): sheet inferior (`ui/sheet`) con tiles de 3 columnas, «Copiar
 * enlace» y «Más opciones…» (`navigator.share`, solo si existe). El botón se renderiza igual en
 * ambos casos; solo cambia el contenedor. Sin scripts de terceros: cada red es un enlace armado
 * con `encodeURIComponent` sobre `window.location.href`, en pestaña nueva con
 * `rel="noopener noreferrer"`. «Copiado» se anuncia por `aria-live="polite"`. Radix cierra con Esc
 * y devuelve el foco al botón.
 *
 * @example
 * ```tsx
 * <LDCSocialShareButtons title="Santiago" variant="dark" />
 * ```
 */
export function LDCSocialShareButtons({
  title,
  className,
  variant = "light",
}: LDCSocialShareButtonsProps) {
  const isMobile = useIsMobile(768);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [canShare, setCanShare] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  // La URL y el soporte de Web Share se leen al abrir (solo existen en el navegador).
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setUrl(window.location.href);
      setCanShare(typeof navigator.share === "function");
    }
    setOpen(next);
  };

  const { networks, mail, message } = buildLinks(title, url);

  const scheduleReset = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), COPY_RESET_MS);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopyState("copied");
    } catch {
      setCopyState("error");
      // En el sheet, la URL de la vista previa queda seleccionada para copiarla a mano.
      const el = urlRef.current;
      const selection = window.getSelection();
      if (isMobile && el && selection) {
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    scheduleReset();
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `${title} - La Guía de Chile`,
        text: message,
        url: url || window.location.href,
      });
      setOpen(false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error("Error al compartir:", err);
    }
  };

  const copyLabel =
    copyState === "copied" ? "Enlace copiado" : copyState === "error" ? "No se pudo copiar" : "Copiar enlace";
  const liveMessage =
    copyState === "copied"
      ? "Enlace copiado al portapapeles"
      : copyState === "error"
        ? isMobile
          ? "No se pudo copiar; selecciona el enlace"
          : "No se pudo copiar; copia el enlace desde la barra de direcciones"
        : "";

  const copyOption = (
    <LDCShareOption
      icon={copyState === "copied" ? Check : LinkIcon}
      iconClassName={
        copyState === "copied"
          ? "animate-in fade-in zoom-in-60 duration-150 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:animate-none"
          : undefined
      }
      label={copyLabel}
      tone={copyState === "copied" ? "success" : "default"}
      onClick={handleCopy}
    />
  );

  const isLight = variant === "light";
  const trigger = (
    <button
      type="button"
      aria-label="Compartir"
      className={cn(
        "inline-flex min-h-11 md:min-h-9 items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink dark:focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isLight
          ? "bg-white/20 border border-white/30 text-white hover:bg-white/30 data-[state=open]:bg-white/30 dark:bg-card dark:border-border dark:text-foreground dark:hover:bg-muted dark:data-[state=open]:bg-muted"
          : "bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20 data-[state=open]:bg-foreground/20",
      )}
    >
      <Share2 className="h-4 w-4" aria-hidden />
      <span className="text-sm font-medium">Compartir</span>
    </button>
  );

  const liveRegion = (
    <span className="sr-only" aria-live="polite" role="status">
      {liveMessage}
    </span>
  );

  let menu: ReactNode;
  if (isMobile) {
    menu = (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className={cn(
            "gap-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))]",
            "data-[state=open]:duration-300 data-[state=closed]:duration-300 ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none",
          )}
        >
          <div aria-hidden className="mx-auto mt-1 mb-2 h-1 w-9 rounded-full bg-muted-foreground/45" />
          <div className="mb-2 flex items-center justify-between gap-2">
            <SheetTitle className="text-base font-black">Compartir</SheetTitle>
            <SheetClose
              aria-label="Cerrar"
              className="inline-grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink dark:focus-visible:ring-yellow"
            >
              <X className="size-4" aria-hidden />
            </SheetClose>
          </div>
          <div className="mb-4 min-w-0 rounded-lg border border-border bg-card p-3">
            <SheetDescription className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
              {title}
            </SheetDescription>
            <span ref={urlRef} className="mt-1 block truncate select-all font-open-sans text-xs text-muted-foreground">
              {url.replace(/^https?:\/\//, "")}
            </span>
          </div>
          <div className="mb-2 grid grid-cols-3 gap-2">
            {networks.map((n) => (
              <LDCShareOption key={n.label} variant="tile" icon={n.icon} label={n.label} href={n.href} external />
            ))}
            <LDCShareOption variant="tile" icon={Mail} label="Correo" href={mail} />
          </div>
          <div role="separator" className="my-1 h-px bg-border" />
          {copyOption}
          {canShare && (
            <LDCShareOption icon={Ellipsis} label="Más opciones…" hint="del teléfono" onClick={handleNativeShare} />
          )}
          {liveRegion}
        </SheetContent>
      </Sheet>
    );
  } else {
    menu = (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          collisionPadding={16}
          aria-labelledby={titleId}
          // FocusScope de Radix descarta los <a> al elegir el primer foco (`removeLinks`) y caería en
          // «Copiar enlace»; se enfoca a mano la primera opción (WhatsApp), como pide el lienzo.
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            (event.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>("a, button")?.focus();
          }}
          className="w-80 max-w-[calc(100vw-2rem)] rounded-xl p-2 duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
        >
          <p id={titleId} className="px-3 pt-1 pb-2 text-sm font-extrabold">
            Compartir
            <span className="mt-0.5 line-clamp-1 font-open-sans text-xs font-medium text-muted-foreground">
              {title}
            </span>
          </p>
          {networks.map((n) => (
            <LDCShareOption key={n.label} icon={n.icon} label={n.label} href={n.href} external />
          ))}
          <div role="separator" className="my-1 h-px bg-border" />
          <LDCShareOption icon={Mail} label="Correo" href={mail} />
          {copyOption}
          {liveRegion}
        </PopoverContent>
      </Popover>
    );
  }

  return <div className={cn("flex items-center", className)}>{menu}</div>;
}
