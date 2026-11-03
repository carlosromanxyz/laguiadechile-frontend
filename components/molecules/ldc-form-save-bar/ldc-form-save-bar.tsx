import { CircleCheck, Info, Save } from "lucide-react";
import type { ReactNode } from "react";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Dónde va la barra: fija al pie del `<main>` o como pie de un panel (`LDCPanel` sin padding). */
export type LDCFormSaveBarPlacement = "sticky" | "panel";

const placements: Record<LDCFormSaveBarPlacement, string> = {
  sticky:
    "sticky bottom-0 z-10 -mx-4 -mb-4 bg-background px-4 py-3 md:-mx-6 md:-mb-6 md:px-6",
  panel: "rounded-b-xl bg-muted/50 px-5 py-3",
};

export interface LDCFormSaveBarProps {
  /** Qué pasa al guardar (se lee antes de hacerlo) */
  note: ReactNode;
  /** Texto del botón de guardar */
  submitText: string;
  /** Texto mientras guarda */
  savingText?: string;
  /** Ícono del botón de guardar (por defecto, `Save`) */
  submitIcon?: ReactNode;
  /** Está guardando */
  saving?: boolean;
  /** Deshabilita guardar (p. ej. sin cambios o con subidas en curso) */
  submitDisabled?: boolean;
  /** Deshabilita descartar (sin cambios) */
  discardDisabled?: boolean;
  /** Descartar cambios (el llamador decide si pide confirmación); sin él, no hay «Descartar» */
  onDiscard?: () => void;
  /**
   * `sticky` (por defecto): fija al pie del `<main>` del panel, para formularios largos.
   * `panel`: pie de un `LDCPanel` con `p-0` (fondo `muted/50`, sin `sticky` ni márgenes negativos).
   */
  placement?: LDCFormSaveBarPlacement;
  /**
   * Mensaje de éxito tras guardar: reemplaza la nota y se anuncia en una región `role="status"`
   * que siempre está en el árbol de accesibilidad (vacía, `sr-only`), así el lector de pantalla
   * lo lee al aparecer.
   */
  success?: ReactNode;
  className?: string;
}

/**
 * LDCFormSaveBar - Pie de guardado de un formulario
 *
 * El aviso de lo que pasa al guardar a la izquierda y «Descartar» + el CTA (`type="submit"`) a la
 * derecha. Con `placement="sticky"` es fija al pie del `<main>` del panel y compensa su padding
 * con márgenes negativos; con `placement="panel"` es el pie de un panel. Tras guardar, `success`
 * cambia la nota por el mensaje en verde (aparece con opacidad y desplazamiento, sin animación si
 * se pide movimiento reducido). En pantallas angostas el CTA ocupa el ancho disponible.
 *
 * @example
 * <LDCFormSaveBar placement="panel" note="…" submitText="Guardar cambios" success={saved && "Guardamos tu nombre."} … />
 */
export function LDCFormSaveBar({
  note,
  submitText,
  savingText = "Guardando…",
  submitIcon,
  saving,
  submitDisabled,
  discardDisabled,
  onDiscard,
  placement = "sticky",
  success,
  className,
}: LDCFormSaveBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t",
        placements[placement],
        className,
      )}
    >
      <p
        role="status"
        className="min-w-0 flex-[1_1_260px] font-mulish text-sm font-bold text-success empty:sr-only"
      >
        {success ? (
          <span className="flex items-start gap-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out">
            <CircleCheck
              className="mt-0.5 size-4 shrink-0 motion-safe:animate-in motion-safe:zoom-in-60 motion-safe:duration-150"
              aria-hidden
            />
            <span>{success}</span>
          </span>
        ) : null}
      </p>
      {!success && (
        <p className="flex min-w-0 flex-[1_1_260px] items-start gap-2 font-open-sans text-[13px] text-muted-foreground [&_b]:font-mulish [&_b]:text-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-orange dark:text-yellow" aria-hidden />
          <span>{note}</span>
        </p>
      )}
      <div className="flex flex-auto justify-end gap-2">
        {onDiscard && (
          <Button type="button" variant="ghost" className="h-10" onClick={onDiscard} disabled={discardDisabled || saving}>
            Descartar
          </Button>
        )}
        <LDCCTAButton
          type="submit"
          text={submitText}
          loading={saving}
          loadingText={savingText}
          disabled={submitDisabled}
          icon={submitIcon ?? <Save className="size-4" aria-hidden />}
          className="h-10 justify-center max-[479px]:flex-1"
        />
      </div>
    </div>
  );
}
