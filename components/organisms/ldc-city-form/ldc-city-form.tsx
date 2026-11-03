"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LDCCheckboxField } from "@/components/molecules/ldc-checkbox-field";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDCImageUpload } from "@/components/molecules/ldc-image-upload";
import { Button } from "@/components/ui/button";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { cityFormSchema, type LDCCityFormValues } from "@/validations/admin-catalog-schema";

export interface LDCCityFormProps {
  /** Define el texto del aviso al guardar («creada» o «actualizada») */
  mode: "create" | "edit";
  /** Server action que guarda (en edición, ya ligada al id con `.bind`) */
  action: (values: LDCCityFormValues) => Promise<IDashboardActionResult>;
  /** Ruta a la que vuelve tras guardar o cancelar */
  returnHref: string;
  initial: LDCCityFormValues;
  /** Regiones para el combobox */
  regions: { id: string; name: string; slug: string }[];
}

/**
 * LDCCityForm - Alta y edición de una ciudad del catálogo admin (como `LDCCategoryForm`)
 *
 * Nombre, slug, región (`LDCCombobox`), descripción, imagen (`LDCImageUpload`, sube a MinIO) y las
 * marcas «Destacada» y «Capital regional». La server action devuelve `{ ok, message }`.
 */
export function LDCCityForm({ mode, action, returnHref, initial, regions }: LDCCityFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageBusy, setImageBusy] = useState(false);
  const form = useForm<LDCCityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: initial,
    mode: "onTouched",
  });
  const { control } = form;

  function onSubmit(values: LDCCityFormValues) {
    startTransition(async () => {
      const result = await action(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(mode === "create" ? "Ciudad creada" : "Ciudad actualizada");
      router.push(returnHref);
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid max-w-2xl gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <LDCFormField control={control} name="name" label="Nombre" placeholder="Viña del Mar" required disabled={pending} />
        <LDCFormField
          control={control}
          name="slug"
          label="Slug"
          placeholder="vina-del-mar"
          description="Identificador único en la URL (minúsculas, números y guiones)."
          required
          disabled={pending}
        />
      </div>
      <LDCFormField
        control={control}
        name="regionId"
        label="Región"
        optional
        render={({ field, id, invalid, describedBy, disabled }) => (
          <LDCCombobox
            id={id}
            items={regions}
            value={regions.find((r) => r.id === field.value)?.slug ?? ""}
            onValueChange={(slug) => {
              field.onChange(regions.find((r) => r.slug === slug)?.id ?? "");
              field.onBlur();
            }}
            placeholder="Elige una región"
            searchPlaceholder="Buscar región…"
            emptyText="No encontramos esa región."
            aria-invalid={invalid}
            aria-describedby={describedBy}
            disabled={disabled || pending}
            className="h-10 bg-transparent font-normal dark:bg-input/30"
          />
        )}
      />
      <LDCFormField
        control={control}
        name="description"
        label="Descripción"
        type="textarea"
        rows={4}
        optional
        disabled={pending}
      />
      <LDCFormField
        control={control}
        name="image"
        label="Imagen"
        optional
        render={({ field, id, invalid, describedBy, disabled, setLocalError }) => (
          <LDCImageUpload
            id={id}
            value={field.value}
            onChange={(url) => {
              field.onChange(url);
              field.onBlur();
            }}
            onError={setLocalError}
            onBusyChange={setImageBusy}
            alt={`Imagen de ${form.getValues("name") || "la ciudad"}`}
            hint="Se ve en la página de la ciudad. JPG, PNG o WebP, hasta 5 MB. Mejor en horizontal (4:3)."
            invalid={invalid}
            describedBy={describedBy}
            disabled={disabled || pending}
          />
        )}
      />
      <div className="grid gap-3">
        <LDCCheckboxField control={control} name="featured" label="Destacada" disabled={pending} />
        <LDCCheckboxField control={control} name="isCapital" label="Capital regional" disabled={pending} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending || imageBusy}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push(returnHref)} disabled={pending}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
