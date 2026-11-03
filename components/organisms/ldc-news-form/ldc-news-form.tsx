"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LDCCheckboxField } from "@/components/molecules/ldc-checkbox-field";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDCFormSaveBar } from "@/components/molecules/ldc-form-save-bar";
import { LDCImageUpload } from "@/components/molecules/ldc-image-upload";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { newsFormSchema, type LDCNewsFormValues } from "@/validations/admin-catalog-schema";

export interface LDCNewsFormProps {
  mode: "create" | "edit";
  /** Server action que guarda (en edición, ya ligada al id con `.bind`) */
  action: (values: LDCNewsFormValues) => Promise<IDashboardActionResult>;
  /** Ruta a la que vuelve tras guardar */
  returnHref: string;
  initial: LDCNewsFormValues;
  /**
   * El texto guardado tiene etiquetas además de `<p>`/`<br>` (títulos, listas, enlaces): el campo
   * avisa que, si se edita, se guarda como párrafos simples (sin tocarlo, la action conserva el HTML).
   */
  richContent?: boolean;
  /** Categorías para el combobox */
  categories: { id: string; name: string; slug: string; icon?: string }[];
}

/** Sección del formulario: `LDCDashboardCard` con bajada opcional (como en `LDCListingForm`). */
function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <LDCDashboardCard id={id} title={title} description={sub} className="scroll-mt-20">
      <div className="flex flex-col gap-6">{children}</div>
    </LDCDashboardCard>
  );
}

/**
 * LDCNewsForm - Alta y edición de una noticia en página propia (CLGDC-126)
 *
 * Secciones Contenido (título, slug, bajada y texto), Publicación (categoría, fecha, autor y
 * «Destacada») e Imágenes (principal y foto del autor con `LDCImageUpload`, suben a MinIO), con `LDCFormField` y el pie fijo
 * `LDCFormSaveBar`. El texto se edita plano, con los párrafos separados por una línea en blanco.
 * La server action devuelve `{ ok, message }`; al guardar vuelve al listado.
 */
export function LDCNewsForm({ mode, action, returnHref, initial, richContent, categories }: LDCNewsFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [imageBusy, setImageBusy] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const busy = imageBusy || avatarBusy;
  const form = useForm<LDCNewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: initial,
    mode: "onTouched",
  });
  const { control, formState } = form;
  const isCreate = mode === "create";

  function onSubmit(values: LDCNewsFormValues) {
    startSaving(async () => {
      const result = await action(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(isCreate ? "Noticia creada" : "Noticia actualizada");
      router.push(returnHref);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => toast.error("Revisa los campos marcados en rojo."))}
      noValidate
    >
      <div className="flex max-w-3xl flex-col gap-4">
        <Section id="noticia-contenido" title="Contenido">
          <LDCFormField control={control} name="title" label="Título" required disabled={saving} />
          <LDCFormField
            control={control}
            name="slug"
            label="Slug"
            placeholder="nuevas-medidas-comercio-local"
            description="Identificador único en la URL (minúsculas, números y guiones)."
            required
            disabled={saving}
          />
          <LDCFormField
            control={control}
            name="excerpt"
            label="Bajada"
            type="textarea"
            rows={3}
            description="Resumen que se ve en las tarjetas y bajo el título."
            required
            disabled={saving}
          />
          <LDCFormField
            control={control}
            name="content"
            label="Texto"
            type="textarea"
            rows={12}
            optional
            description={
            richContent
              ? "Este texto tiene formato (títulos, listas o enlaces). Si no lo tocas, se conserva; si lo editas, se guarda como párrafos simples."
              : "Separa los párrafos con una línea en blanco."
          }
            disabled={saving}
          />
        </Section>

        <Section id="noticia-publicacion" title="Publicación">
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField
              control={control}
              name="categoryId"
              label="Categoría"
              optional
              render={({ field, id, invalid, describedBy, disabled }) => (
                <LDCCombobox
                  id={id}
                  items={categories}
                  value={categories.find((c) => c.id === field.value)?.slug ?? ""}
                  onValueChange={(slug) => {
                    field.onChange(categories.find((c) => c.slug === slug)?.id ?? "");
                    field.onBlur();
                  }}
                  placeholder="Elige una categoría"
                  searchPlaceholder="Buscar categoría…"
                  emptyText="No encontramos esa categoría."
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  disabled={disabled || saving}
                  className="h-10 bg-transparent font-normal dark:bg-input/30"
                />
              )}
            />
            <LDCFormField
              control={control}
              name="publishedAt"
              label="Fecha de publicación"
              type="date"
              required
              disabled={saving}
            />
          </div>
          <LDCFormField control={control} name="authorName" label="Autor" required disabled={saving} />
          <LDCCheckboxField control={control} name="featured" label="Destacada" disabled={saving} />
        </Section>

        <Section id="noticia-imagenes" title="Imágenes">
          <LDCFormField
            control={control}
            name="image"
            label="Imagen principal"
            required
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
                alt={`Imagen principal de ${form.getValues("title") || "la noticia"}`}
                hint="Se ve en la tarjeta y arriba de la noticia. JPG, PNG o WebP, hasta 5 MB. Mejor en horizontal (4:3)."
                invalid={invalid}
                describedBy={describedBy}
                disabled={disabled || saving}
              />
            )}
          />
          <LDCFormField
            control={control}
            name="authorAvatar"
            label="Foto del autor"
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
                onBusyChange={setAvatarBusy}
                alt={form.getValues("authorName") ? `Foto de ${form.getValues("authorName")}` : "Foto del autor"}
                hint="Se ve junto al nombre del autor. Mejor cuadrada. JPG, PNG o WebP, hasta 5 MB."
                invalid={invalid}
                describedBy={describedBy}
                disabled={disabled || saving}
              />
            )}
          />
        </Section>
      </div>

      <LDCFormSaveBar
        className="mt-6"
        note={
          busy ? (
            <b>Espera a que terminen de subir las imágenes para guardar.</b>
          ) : (
            <>
              <b>Se publica al guardar.</b> Los cambios se ven en el sitio enseguida.
            </>
          )
        }
        submitText={isCreate ? "Crear noticia" : "Guardar cambios"}
        saving={saving}
        submitDisabled={busy || saving || (!isCreate && !formState.isDirty)}
        discardDisabled={!formState.isDirty}
        onDiscard={() => form.reset(initial)}
      />
    </form>
  );
}
