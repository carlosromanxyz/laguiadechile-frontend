"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, CircleX, GripVertical, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { LDCUploadProgress } from "@/components/atoms/ldc-upload-progress";
import { LDCImageDropzone } from "@/components/atoms/ldc-image-dropzone";
import { Button } from "@/components/ui/button";
import {
  IMAGE_UPLOAD_ACCEPT,
  ImageUploadError,
  uploadImage,
  validateImageFile,
  type IUploadHandle,
} from "@/lib/uploads/image-upload";
import { cn } from "@/lib/utils";

export interface LDCImageGalleryProps {
  /** Id del botón «Agregar fotos» (la etiqueta del campo apunta a él) */
  id: string;
  /** URLs de la galería, en orden */
  value: string[];
  onChange: (urls: string[]) => void;
  /** Último error de archivo (lo pinta el `FieldError` del campo); `null` lo limpia */
  onError: (message: string | null) => void;
  /** Avisa si hay subidas en curso (para bloquear el guardado) */
  onBusyChange?: (busy: boolean) => void;
  /** Máximo de fotos */
  max: number;
  /** Nombre del negocio, para el texto alternativo («Foto 2 de la galería de …») */
  title: string;
  describedBy?: string;
  disabled?: boolean;
}

interface IPending {
  key: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
  handle?: IUploadHandle;
}

let seq = 0;

const ENTER = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

/**
 * LDCImageGallery - Galería editable: subir, ordenar y quitar fotos
 *
 * Va dentro de `LDCFormField` (modo `render`). Cada foto se sube en su propia petición a
 * `POST /api/uploads`, con su avance en la miniatura; un archivo inválido queda como miniatura de
 * error y en el `FieldError`. El orden se cambia con «Mover antes» / «Mover después» (teclado y
 * lector, anunciado en `aria-live`) y, en escritorio, arrastrando. Entradas y reordenamiento con
 * Framer Motion (200 ms, solo `opacity`/`transform`); con `prefers-reduced-motion` todo es
 * instantáneo y la barra de avance sigue visible.
 */
export function LDCImageGallery({
  id,
  value,
  onChange,
  onError,
  onBusyChange,
  max,
  title,
  describedBy,
  disabled,
}: LDCImageGalleryProps) {
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  const [pending, setPending] = useState<IPending[]>([]);
  const [announce, setAnnounce] = useState("");
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropActive, setDropActive] = useState(false);
  /** Vistas previas locales de lo ya subido (url → blob), para no volver a descargarlas. */
  const [local, setLocal] = useState<Record<string, string>>({});
  const blobs = useRef<Set<string>>(new Set());
  const handles = useRef<Set<IUploadHandle>>(new Set());

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const created = blobs.current;
    const live = handles.current;
    return () => {
      live.forEach((h) => h.abort());
      created.forEach((b) => URL.revokeObjectURL(b));
    };
  }, []);

  const uploading = pending.filter((p) => !p.error).length;
  useEffect(() => {
    onBusyChange?.(uploading > 0);
  }, [uploading, onBusyChange]);

  const slots = max - value.length - uploading;
  const total = value.length + uploading;

  function patch(key: string, next: Partial<IPending> | null) {
    setPending((list) =>
      next === null ? list.filter((p) => p.key !== key) : list.map((p) => (p.key === key ? { ...p, ...next } : p)),
    );
  }

  function addFiles(files: FileList | File[] | null) {
    if (!files || disabled) return;
    let free = slots;
    let lastError: string | null = null;
    const added: IPending[] = [];
    for (const file of Array.from(files)) {
      const key = `p${++seq}`;
      const problem = free <= 0 ? `${file.name}: ya tienes ${max} fotos.` : validateImageFile(file);
      if (problem) {
        lastError = problem;
        added.push({ key, file, preview: "", progress: 0, error: problem });
        continue;
      }
      free -= 1;
      const preview = URL.createObjectURL(file);
      blobs.current.add(preview);
      const handle = uploadImage(file, (progress) => patch(key, { progress }));
      handles.current.add(handle);
      added.push({ key, file, preview, progress: 0, handle });
      handle.promise.then(
        ({ url }) => {
          handles.current.delete(handle);
          setLocal((m) => ({ ...m, [url]: preview }));
          patch(key, null);
          onChange([...valueRef.current, url]);
          valueRef.current = [...valueRef.current, url];
        },
        (err: unknown) => {
          handles.current.delete(handle);
          if (err instanceof DOMException && err.name === "AbortError") {
            patch(key, null);
            return;
          }
          const message = err instanceof ImageUploadError ? err.message : `No pudimos subir ${file.name}.`;
          onError(message);
          patch(key, { error: message, handle: undefined });
        },
      );
    }
    onError(lastError);
    setPending((list) => [...list, ...added]);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setAnnounce(`Foto ${from + 1} movida a la posición ${to + 1} de ${value.length}.`);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
    setAnnounce(`Foto ${index + 1} quitada. Quedan ${value.length - 1}.`);
  }

  const layoutTransition = reduce ? { duration: 0 } : { duration: 0.2 };
  const initial = reduce ? false : { opacity: 0, scale: 0.96 };

  return (
    <div
      onDragOver={(e: DragEvent) => {
        if (dragFrom === null && e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setDropActive(true);
        }
      }}
      onDragLeave={() => setDropActive(false)}
      onDrop={(e: DragEvent) => {
        if (dragFrom !== null || !e.dataTransfer.files.length) return;
        e.preventDefault();
        setDropActive(false);
        addFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        multiple
        className="hidden"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <ul
        aria-label="Fotos de la galería, en orden"
        className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 p-0"
      >
        <AnimatePresence initial={false}>
          {value.map((url, i) => {
            const n = i + 1;
            const src = local[url] ?? url;
            return (
              <motion.li
                key={url}
                layout
                initial={initial}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ ...ENTER, layout: layoutTransition, ...(reduce ? { duration: 0 } : {}) }}
                className={cn("flex min-w-0 flex-col gap-1.5", dragFrom === i && "opacity-50")}
                draggable={!disabled}
                onDragStartCapture={(e: DragEvent) => {
                  setDragFrom(i);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(i));
                }}
                onDragOverCapture={(e: DragEvent) => {
                  if (dragFrom !== null) e.preventDefault();
                }}
                onDropCapture={(e: DragEvent) => {
                  if (dragFrom === null) return;
                  e.preventDefault();
                  move(dragFrom, i);
                  setDragFrom(null);
                }}
                onDragEndCapture={() => setDragFrom(null)}
              >
                <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={src}
                    alt={`Foto ${n} de la galería de ${title}`}
                    fill
                    unoptimized={src.startsWith("blob:")}
                    sizes="160px"
                    className="object-cover"
                    draggable={false}
                  />
                  <span className="absolute top-1.5 left-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-black/70 px-1.5 text-xs font-extrabold text-white">
                    {n}
                  </span>
                  <span
                    aria-hidden
                    className="absolute top-1.5 right-1.5 hidden size-7 cursor-grab place-items-center rounded-md bg-black/55 text-white md:grid"
                    title="Arrastra para cambiar el orden"
                  >
                    <GripVertical className="size-3.5" />
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8"
                    aria-label={`Mover foto ${n} antes`}
                    disabled={disabled || i === 0}
                    onClick={() => move(i, i - 1)}
                  >
                    <ChevronLeft aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8"
                    aria-label={`Mover foto ${n} después`}
                    disabled={disabled || i === value.length - 1}
                    onClick={() => move(i, i + 1)}
                  >
                    <ChevronRight aria-hidden />
                  </Button>
                  <span className="flex-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    aria-label={`Quitar foto ${n}`}
                    disabled={disabled}
                    onClick={() => remove(i)}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
              </motion.li>
            );
          })}

          {pending.map((p) =>
            p.error ? (
              <motion.li
                key={p.key}
                layout
                initial={initial}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? { duration: 0 } : ENTER}
                className="flex min-w-0 flex-col gap-1.5"
              >
                <div className="flex aspect-[4/3] min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-destructive bg-destructive/5 p-2.5 text-center">
                  <CircleX className="size-5 text-destructive" aria-hidden />
                  <b className="text-xs font-extrabold [overflow-wrap:anywhere] text-destructive">{p.error}</b>
                </div>
                <div className="flex items-center gap-1">
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{p.file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    aria-label={`Quitar ${p.file.name}`}
                    onClick={() => {
                      patch(p.key, null);
                      onError(null);
                    }}
                  >
                    <X aria-hidden />
                  </Button>
                </div>
              </motion.li>
            ) : (
              <motion.li
                key={p.key}
                layout
                initial={initial}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? { duration: 0 } : ENTER}
                className="flex min-w-0 flex-col gap-1.5"
              >
                <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-lg border bg-muted">
                  <Image src={p.preview} alt="" fill unoptimized sizes="160px" className="object-cover opacity-75" />
                  <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-black/55 p-2.5 text-xs text-white">
                    <span>
                      <b>Subiendo…</b> {p.progress} %
                    </span>
                    <LDCUploadProgress value={p.progress} label={`Subiendo ${p.file.name}`} />
                  </div>
                  <button
                    type="button"
                    onClick={() => p.handle?.abort()}
                    aria-label={`Cancelar la subida de ${p.file.name}`}
                    className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
                <p className="m-0 truncate text-xs text-muted-foreground">{p.file.name}</p>
              </motion.li>
            ),
          )}

          {slots > 0 && (
            <motion.li key="add" layout transition={{ layout: layoutTransition }} className="flex min-w-0 flex-col">
              <LDCImageDropzone
                id={id}
                label="Agregar fotos"
                small={`${total} de ${max}`}
                drag={dropActive}
                describedBy={describedBy}
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="aspect-[4/3] rounded-lg p-2"
              />
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
