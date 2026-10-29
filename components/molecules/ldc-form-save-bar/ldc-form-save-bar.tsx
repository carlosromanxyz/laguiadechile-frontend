import { Info, Save } from "lucide-react";
import type { ReactNode } from "react";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LDCFormSaveBarProps {
  /** Qué pasa al guardar (se lee antes de hacerlo) */
  note: ReactNode;
  /** Texto del botón de guardar */
  submitText: string;
  /** Texto mientras guarda */
  savingText?: string;
  /** Está guardando */
  saving?: boolean;
  /** Deshabilita guardar (p. ej. sin cambios o con subidas en curso) */
  submitDisabled?: boolean;
  /** Deshabilita descartar (sin cambios) */
  discardDisabled?: boolean;
  /** Descartar cambios (el llamador decide si pide confirmación) */
  onDiscard: () => void;
  className?: string;
}

/**
 * LDCFormSaveBar - Barra fija al pie de un formulario largo
 *
 * El aviso de lo que pasa al guardar a la izquierda y «Descartar» + el CTA naranjo (`type="submit"`)
 * a la derecha. Es `sticky` al pie del `<main>` del panel; se compensa el padding del panel con
 * márgenes negativos. En pantallas angostas el CTA ocupa el ancho disponible.
 */
export function LDCFormSaveBar({
  note,
  submitText,
  savingText = "Guardando…",
  saving,
  submitDisabled,
  discardDisabled,
  onDiscard,
  className,
}: LDCFormSaveBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-4 -mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t bg-background px-4 py-3 md:-mx-6 md:-mb-6 md:px-6",
        className,
      )}
    >
      <p className="flex min-w-0 flex-[1_1_260px] items-start gap-2 font-open-sans text-[13px] text-muted-foreground [&_b]:font-mulish [&_b]:text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-orange dark:text-yellow" aria-hidden />
        <span>{note}</span>
      </p>
      <div className="flex flex-auto justify-end gap-2">
        <Button type="button" variant="ghost" className="h-10" onClick={onDiscard} disabled={discardDisabled || saving}>
          Descartar
        </Button>
        <LDCCTAButton
          type="submit"
          text={submitText}
          loading={saving}
          loadingText={savingText}
          disabled={submitDisabled}
          icon={<Save className="size-4" aria-hidden />}
          className="h-10 justify-center max-[479px]:flex-1"
        />
      </div>
    </div>
  );
}
