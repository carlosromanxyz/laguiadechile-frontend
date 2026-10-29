"use client";

import Image from "next/image";
import { CircleX, ImageIcon, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import { LDCImageDropzone } from "@/components/atoms/ldc-image-dropzone";
import { LDCUploadProgress } from "@/components/atoms/ldc-upload-progress";
import { Button } from "@/components/ui/button";
import {
  formatFileSize,
  IMAGE_UPLOAD_ACCEPT,
  ImageUploadError,
  uploadImage,
  validateImageFile,
  type IUploadHandle,
} from "@/lib/uploads/image-upload";
import { cn } from "@/lib/utils";

export interface LDCImageUploadProps {
  /** Id del control principal (lo pone `LDCFormField`: la etiqueta apunta a él) */
  id: string;
  /** URL de la imagen actual (`/media/u/…` o la que ya tenía); vacío si no hay */
  value: string;
  /** Nueva URL tras subir, o `""` al quitar */
  onChange: (url: string) => void;
  /** Error de tipo, tamaño o subida (lo pinta el `FieldError` del campo); `null` lo limpia */
  onError: (message: string | null) => void;
  /** Avisa si hay una subida en curso (para bloquear el guardado) */
  onBusyChange?: (busy: boolean) => void;
  /** Texto alternativo de la imagen */
  alt: string;
  /** Ayuda junto a la imagen elegida */
  hint?: ReactNode;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
}

type Phase =
  | { kind: "idle" }
  | { kind: "uploading"; file: File; preview: string; progress: number }
  | { kind: "failed"; file: File; message: string };

/**
 * LDCImageUpload - Subida de una imagen (la principal de la ficha)
 *
 * Va dentro de `LDCFormField` (modo `render`). Estados: vacío, arrastrando encima, subiendo
 * (vista previa local, velo con avance real y cancelar), lista (reemplazar o quitar), error de
 * tipo o tamaño (se valida antes de subir) y falla de la subida (reintentar o descartar). Sube a
 * `POST /api/uploads` y guarda la `url` (`/media/u/…`). La vista previa local se libera al
 * desmontar.
 *
 * @example
 * <LDCFormField control={control} name="image" label="Imagen principal"
 *   render={({ field, id, invalid, describedBy, setLocalError }) => (
 *     <LDCImageUpload id={id} value={field.value} onChange={field.onChange} onError={setLocalError}
 *       invalid={invalid} describedBy={describedBy} alt="Imagen principal" />
 *   )} />
 */
export function LDCImageUpload({
  id,
  value,
  onChange,
  onError,
  onBusyChange,
  alt,
  hint,
  invalid,
  describedBy,
  disabled,
}: LDCImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<IUploadHandle | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [drag, setDrag] = useState(false);
  /** Vista previa local de la última subida, para no volver a descargarla. */
  const [local, setLocal] = useState<{ url: string; blob: string } | null>(null);
  const blobs = useRef<Set<string>>(new Set());

  useEffect(() => {
    const created = blobs.current;
    return () => {
      handleRef.current?.abort();
      created.forEach((b) => URL.revokeObjectURL(b));
    };
  }, []);

  useEffect(() => {
    onBusyChange?.(phase.kind === "uploading");
  }, [phase.kind, onBusyChange]);

  const pick = () => inputRef.current?.click();

  function start(file: File) {
    const problem = validateImageFile(file);
    if (problem) {
      onError(problem);
      setPhase({ kind: "idle" });
      return;
    }
    onError(null);
    const preview = URL.createObjectURL(file);
    blobs.current.add(preview);
    setPhase({ kind: "uploading", file, preview, progress: 0 });
    const handle = uploadImage(file, (progress) =>
      setPhase((p) => (p.kind === "uploading" && p.file === file ? { ...p, progress } : p)),
    );
    handleRef.current = handle;
    handle.promise.then(
      ({ url }) => {
        setLocal({ url, blob: preview });
        setPhase({ kind: "idle" });
        onChange(url);
      },
      (err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          setPhase({ kind: "idle" });
          return;
        }
        const message = err instanceof ImageUploadError ? err.message : `No pudimos subir ${file.name}.`;
        onError(message);
        setPhase({ kind: "failed", file, message });
      },
    );
  }

  function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) start(file);
  }

  const dragProps = disabled
    ? {}
    : {
        onDragOver: (e: DragEvent) => {
          e.preventDefault();
          setDrag(true);
        },
        onDragLeave: () => setDrag(false),
        onDrop: (e: DragEvent) => {
          e.preventDefault();
          setDrag(false);
          onFiles(e.dataTransfer.files);
        },
      };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={IMAGE_UPLOAD_ACCEPT}
      className="hidden"
      tabIndex={-1}
      aria-hidden
      onChange={(e) => {
        onFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );

  const hintNode = hint ? <p className="m-0 font-open-sans text-sm text-muted-foreground">{hint}</p> : null;

  if (phase.kind === "uploading") {
    const done = (phase.file.size * phase.progress) / 100;
    return (
      <div className="grid min-w-0 gap-4 sm:grid-cols-[240px_minmax(0,1fr)] sm:items-start">
        <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-lg border bg-muted">
          <Image src={phase.preview} alt="" fill unoptimized sizes="240px" className="object-cover opacity-75" />
          <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-black/55 p-2.5 text-xs text-white">
            <span>
              <b>Subiendo…</b> {phase.progress} %
            </span>
            <LDCUploadProgress value={phase.progress} label="Subiendo imagen principal" />
          </div>
          <button
            type="button"
            onClick={() => handleRef.current?.abort()}
            aria-label="Cancelar subida"
            className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="grid min-w-0 gap-2">
          <p className="m-0 flex min-w-0 items-center gap-2 text-sm font-bold">
            <ImageIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate">{phase.file.name}</span>
          </p>
          <p className="m-0 font-open-sans text-xs text-muted-foreground">
            {formatFileSize(done)} de {formatFileSize(phase.file.size)}
          </p>
        </div>
      </div>
    );
  }

  if (phase.kind === "failed") {
    return (
      <div className="grid min-w-0 gap-4 sm:grid-cols-[240px_minmax(0,1fr)] sm:items-start">
        {input}
        <div className="flex aspect-[4/3] min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-destructive bg-destructive/5 p-2.5 text-center">
          <CircleX className="size-5 text-destructive" aria-hidden />
          <b className="text-xs font-extrabold [overflow-wrap:anywhere] text-destructive">No pudimos subir la imagen</b>
          <small className="font-open-sans text-[11px] text-muted-foreground [overflow-wrap:anywhere]">
            {phase.file.name}
          </small>
        </div>
        <div className="grid min-w-0 gap-3">
          <p className="m-0 font-open-sans text-sm text-muted-foreground">Revisa tu conexión e inténtalo de nuevo.</p>
          <div className="flex flex-wrap gap-2">
            <Button id={id} type="button" variant="outline" onClick={() => start(phase.file)} aria-describedby={describedBy}>
              <RefreshCw aria-hidden />
              Reintentar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                onError(null);
                setPhase({ kind: "idle" });
              }}
            >
              <X aria-hidden />
              Descartar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="grid gap-2" {...dragProps}>
        {input}
        <LDCImageDropzone
          id={id}
          big
          drag={drag}
          invalid={invalid}
          describedBy={describedBy}
          disabled={disabled}
          onClick={pick}
        />
        {hintNode}
      </div>
    );
  }

  const src = local?.url === value ? local.blob : value;
  return (
    <div
      className={cn(
        "grid min-w-0 gap-4 rounded-lg sm:grid-cols-[240px_minmax(0,1fr)] sm:items-start",
        drag && "outline-2 outline-offset-4 outline-pink outline-dashed dark:outline-yellow",
      )}
      {...dragProps}
    >
      {input}
      <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-lg border bg-muted">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={src.startsWith("blob:")}
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover"
        />
      </div>
      <div className="grid min-w-0 gap-3">
        {hintNode}
        <div className="flex flex-wrap gap-2">
          <Button
            id={id}
            type="button"
            variant="outline"
            onClick={pick}
            disabled={disabled}
            aria-describedby={describedBy}
          >
            <RefreshCw aria-hidden />
            Reemplazar
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onChange("")}
            disabled={disabled}
          >
            <Trash2 aria-hidden />
            Quitar
          </Button>
        </div>
      </div>
    </div>
  );
}
