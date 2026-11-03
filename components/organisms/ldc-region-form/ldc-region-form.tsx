"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { Button } from "@/components/ui/button";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { regionFormSchema, type LDCRegionFormValues } from "@/validations/admin-catalog-schema";

export interface LDCRegionFormProps {
  /** Define el texto del aviso al guardar («creada» o «actualizada») */
  mode: "create" | "edit";
  /** Server action que guarda (en edición, ya ligada al id con `.bind`) */
  action: (values: LDCRegionFormValues) => Promise<IDashboardActionResult>;
  /** Ruta a la que vuelve tras guardar o cancelar */
  returnHref: string;
  initial: LDCRegionFormValues;
}

/**
 * LDCRegionForm - Alta y edición de una región del catálogo admin (como `LDCCategoryForm`)
 *
 * Nombre, número romano y slug con `LDCFormField`; la server action devuelve `{ ok, message }`.
 */
export function LDCRegionForm({ mode, action, returnHref, initial }: LDCRegionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<LDCRegionFormValues>({
    resolver: zodResolver(regionFormSchema),
    defaultValues: initial,
    mode: "onTouched",
  });
  const { control } = form;

  function onSubmit(values: LDCRegionFormValues) {
    startTransition(async () => {
      const result = await action(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(mode === "create" ? "Región creada" : "Región actualizada");
      router.push(returnHref);
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid max-w-2xl gap-6">
      <LDCFormField control={control} name="name" label="Nombre" placeholder="Región de Valparaíso" required disabled={pending} />
      <div className="grid gap-6 sm:grid-cols-2">
        <LDCFormField
          control={control}
          name="romanNumeral"
          label="Número romano"
          placeholder="V"
          maxLength={10}
          required
          disabled={pending}
        />
        <LDCFormField
          control={control}
          name="slug"
          label="Slug"
          placeholder="valparaiso"
          description="Identificador único en la URL (minúsculas, números y guiones)."
          required
          disabled={pending}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push(returnHref)} disabled={pending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
