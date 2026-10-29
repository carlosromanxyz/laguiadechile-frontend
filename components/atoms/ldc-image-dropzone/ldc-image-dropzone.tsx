import { ImageUp, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LDCImageDropzoneProps {
  /** Id del botón (la etiqueta del campo apunta a él) */
  id?: string;
  /** Variante grande, con el botón «Elegir archivo» */
  big?: boolean;
  /** Hay un archivo arrastrándose encima */
  drag?: boolean;
  /** Borde de error */
  invalid?: boolean;
  /** Texto principal */
  label?: string;
  /** Texto chico (formatos y tamaño, o «3 de 8») */
  small?: string;
  className?: string;
  describedBy?: string;
  disabled?: boolean;
  /** Abre el selector de archivos */
  onClick: () => void;
}

/**
 * LDCImageDropzone - Zona para soltar o elegir una imagen
 *
 * Es un `<button>` (funciona con teclado y en el teléfono, donde no se arrastra) que abre el
 * `<input type="file">` oculto del llamador. El arrastre lo maneja el contenedor; aquí solo se pinta
 * el estado (`drag`, `invalid`). La usan `LDCImageUpload` y `LDCImageGallery`.
 */
export function LDCImageDropzone({
  id,
  big,
  drag,
  invalid,
  label = "Arrastra una imagen o elige un archivo",
  small = "JPG, PNG o WebP · hasta 5 MB",
  className,
  describedBy,
  disabled,
  onClick,
}: LDCImageDropzoneProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-describedby={describedBy}
      data-invalid={invalid || undefined}
      data-drag={drag || undefined}
      className={cn(
        "flex w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-input bg-transparent px-4 py-6 text-center transition-colors dark:bg-input/30",
        "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "hover:border-pink hover:bg-pink/5 data-[drag]:border-pink data-[drag]:bg-pink/5 dark:hover:border-yellow dark:hover:bg-yellow/5 dark:data-[drag]:border-yellow dark:data-[drag]:bg-yellow/5",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-destructive dark:border-destructive",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full bg-muted text-muted-foreground",
          drag && "text-pink dark:text-yellow",
        )}
        aria-hidden
      >
        {drag ? <Upload className="size-5" /> : <ImageUp className="size-5" />}
      </span>
      <b className="text-sm font-extrabold">{drag ? "Suelta para subir" : label}</b>
      <small className="font-open-sans text-xs text-muted-foreground">{small}</small>
      {big && !drag && (
        <span className="pointer-events-none mt-1 inline-flex h-8 items-center rounded-md border bg-background px-3 text-sm font-medium shadow-xs dark:border-input dark:bg-input/30">
          Elegir archivo
        </span>
      )}
    </button>
  );
}

