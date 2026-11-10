"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { LDCCheckboxField } from "@/components/molecules/ldc-checkbox-field";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDCFormSaveBar } from "@/components/molecules/ldc-form-save-bar";
import { LDCImageGallery } from "@/components/molecules/ldc-image-gallery";
import { LDCImageUpload } from "@/components/molecules/ldc-image-upload";
import { LDCScheduleField } from "@/components/molecules/ldc-schedule-field";
import { LDCSegmentedField } from "@/components/molecules/ldc-segmented-field";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import type { IPlaceType } from "@/interfaces/place";
import { PLACE_TYPES, PLACE_TYPE_META } from "@/lib/format/places";
import {
  PLACE_GALLERY_MAX,
  placeFormSchema,
  type LDCPlaceFormValues,
} from "@/validations/place-form-schema";

export interface LDCPlaceFormProps {
  mode: "create" | "edit";
  /** Server action que guarda (en edición, ya ligada al id con `.bind`) */
  action: (values: LDCPlaceFormValues) => Promise<IDashboardActionResult>;
  /** Ruta a la que vuelve tras guardar */
  returnHref: string;
  initial: LDCPlaceFormValues;
  /** Ciudades para el combobox */
  cities: { id: string; name: string; slug: string }[];
}

/** Sección del formulario: `LDCDashboardCard` con bajada opcional (como en `LDCNewsForm`). */
function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <LDCDashboardCard id={id} title={title} description={sub} className="scroll-mt-20">
      <div className="flex flex-col gap-6">{children}</div>
    </LDCDashboardCard>
  );
}

const TYPE_OPTIONS = PLACE_TYPES.map((t) => ({ value: t, label: PLACE_TYPE_META[t].label }));

/**
 * LDCPlaceForm - Alta y edición de un lugar del admin, en página propia (CLGDC-207)
 *
 * Secciones Lugar (tipo, ciudad, nombre, slug opcional, descripción y «Destacado»), Ubicación
 * (dirección y comuna), Imágenes (principal con `LDCImageUpload` y galería con `LDCImageGallery`,
 * suben a MinIO), Horario (`LDCScheduleField`) y Contacto (teléfono, número de emergencia solo en
 * servicios públicos, sitio web y email), con `LDCFormField` y el pie fijo `LDCFormSaveBar`. La
 * server action devuelve `{ ok, message }`; al guardar vuelve al listado.
 */
export function LDCPlaceForm({ mode, action, returnHref, initial, cities }: LDCPlaceFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [imageBusy, setImageBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const busy = imageBusy || galleryBusy;
  const form = useForm<LDCPlaceFormValues>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: initial,
    mode: "onTouched",
  });
  const { control, formState } = form;
  const isCreate = mode === "create";
  const type = useWatch({ control, name: "type" });
  const title = useWatch({ control, name: "title" });
  const schedule = useWatch({ control, name: "schedule" });

  function onSubmit(values: LDCPlaceFormValues) {
    startSaving(async () => {
      const result = await action(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(isCreate ? "Lugar creado" : "Lugar actualizado");
      router.push(returnHref);
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, () => toast.error("Revisa los campos marcados en rojo."))} noValidate>
      <div className="flex max-w-3xl flex-col gap-4">
        <Section id="lugar-datos" title="Lugar">
          <LDCSegmentedField<IPlaceType>
            legend="Tipo"
            name="lugar-tipo"
            options={TYPE_OPTIONS}
            value={type}
            onChange={(next) => form.setValue("type", next, { shouldDirty: true })}
            description="Atractivo: miradores, playas, museos. Servicio público: municipalidad, CESFAM, comisaría. Feria o mercado: con días fijos."
            disabled={saving}
          />
          <LDCFormField
            control={control}
            name="cityId"
            label="Ciudad"
            required
            render={({ field, id, invalid, describedBy, disabled }) => (
              <LDCCombobox
                id={id}
                items={cities}
                value={cities.find((c) => c.id === field.value)?.slug ?? ""}
                onValueChange={(slug) => {
                  field.onChange(cities.find((c) => c.slug === slug)?.id ?? "");
                  field.onBlur();
                }}
                placeholder="Elige una ciudad"
                searchPlaceholder="Buscar ciudad…"
                emptyText="No encontramos esa ciudad."
                aria-invalid={invalid}
                aria-describedby={describedBy}
                disabled={disabled || saving}
                className="h-10 bg-transparent font-normal dark:bg-input/30"
              />
            )}
          />
          <LDCFormField control={control} name="title" label="Nombre" required disabled={saving} />
          <LDCFormField
            control={control}
            name="slug"
            label="Slug"
            placeholder="mirador-paseo-gervasoni"
            description={
              isCreate
                ? "Identificador en la URL (minúsculas, números y guiones). Si lo dejas vacío, se arma con el nombre."
                : "Identificador en la URL (minúsculas, números y guiones). Si lo cambias, el enlace anterior deja de funcionar."
            }
            optional
            disabled={saving}
          />
          <LDCFormField
            control={control}
            name="description"
            label="Descripción"
            type="textarea"
            rows={6}
            description="Qué es y qué se puede hacer ahí. Separa los párrafos con una línea en blanco."
            required
            disabled={saving}
          />
          <LDCCheckboxField control={control} name="featured" label="Destacado" disabled={saving} />
        </Section>

        <Section id="lugar-ubicacion" title="Ubicación" sub="Se usa para el mapa y el botón «Cómo llegar».">
          <LDCFormField control={control} name="address" label="Dirección" required disabled={saving} />
          <LDCFormField control={control} name="commune" label="Comuna o sector" optional disabled={saving} />
        </Section>

        <Section id="lugar-imagenes" title="Imágenes">
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
                alt={`Imagen principal de ${title || "el lugar"}`}
                hint="Se ve en la tarjeta y arriba de la galería. JPG, PNG o WebP, hasta 5 MB. Mejor en horizontal (16:9)."
                invalid={invalid}
                describedBy={describedBy}
                disabled={disabled || saving}
              />
            )}
          />
          <LDCFormField
            control={control}
            name="gallery"
            label="Galería"
            optional
            description={`Hasta ${PLACE_GALLERY_MAX} fotos. Cambia el orden con las flechas o arrastrando.`}
            render={({ field, id, describedBy, disabled, setLocalError }) => (
              <LDCImageGallery
                id={id}
                value={field.value}
                onChange={(urls) => field.onChange(urls)}
                onError={setLocalError}
                onBusyChange={setGalleryBusy}
                max={Math.max(PLACE_GALLERY_MAX, initial.gallery.length)}
                title={title || "el lugar"}
                describedBy={describedBy}
                disabled={disabled || saving}
              />
            )}
          />
        </Section>

        <Section
          id="lugar-horario"
          title={type === "MARKET" ? "Días de feria" : "Horario"}
          sub={
            type === "MARKET"
              ? "Marca abiertos solo los días en que hay feria."
              : "Si está abierto siempre (un mirador, una playa), deja todos los días abiertos."
          }
        >
          <LDCScheduleField
            id="ldc-lugar-horario"
            value={schedule}
            onChange={(next) => form.setValue("schedule", next, { shouldDirty: true, shouldValidate: formState.isSubmitted })}
            errors={formState.errors.schedule as never}
            disabled={saving}
          />
        </Section>

        <Section id="lugar-contacto" title="Contacto" sub="Todo es opcional.">
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField
              control={control}
              name="phone"
              label="Teléfono"
              type="tel"
              optional
              autoComplete="off"
              icon={<Phone />}
              disabled={saving}
            />
            {type === "PUBLIC_SERVICE" && (
              <LDCFormField
                control={control}
                name="emergencyNumber"
                label="Número de emergencia"
                inputMode="numeric"
                placeholder="Ej.: 131"
                description="Número corto, aparte del teléfono de la oficina: 131 SAMU, 132 Bomberos, 133 Carabineros."
                optional
                maxLength={4}
                disabled={saving}
              />
            )}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField
              control={control}
              name="website"
              label="Sitio web"
              type="url"
              optional
              placeholder="https://"
              autoComplete="off"
              icon={<Globe />}
              disabled={saving}
            />
            <LDCFormField
              control={control}
              name="email"
              label="Email"
              type="email"
              optional
              autoComplete="off"
              icon={<Mail />}
              disabled={saving}
            />
          </div>
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
        submitText={isCreate ? "Crear lugar" : "Guardar cambios"}
        saving={saving}
        submitDisabled={busy || saving || (!isCreate && !formState.isDirty)}
        discardDisabled={!formState.isDirty}
        onDiscard={() => form.reset(initial)}
      />
    </form>
  );
}
