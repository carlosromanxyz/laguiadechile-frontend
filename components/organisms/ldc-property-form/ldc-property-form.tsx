"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { LDCCheckboxField } from "@/components/molecules/ldc-checkbox-field";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCFormField, type LDCFormFieldRenderProps } from "@/components/molecules/ldc-form-field";
import { LDCFormSaveBar } from "@/components/molecules/ldc-form-save-bar";
import { LDCImageGallery } from "@/components/molecules/ldc-image-gallery";
import { LDCImageUpload } from "@/components/molecules/ldc-image-upload";
import {
  PROPERTY_CURRENCIES,
  PROPERTY_OPERATIONS,
  PROPERTY_TYPES,
  type IAdminProperty,
} from "@/interfaces/admin-catalog";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import {
  PROPERTY_CURRENCY_LABELS,
  PROPERTY_GALLERY_MAX,
  PROPERTY_OPERATION_LABELS,
  PROPERTY_PRICE_PERIOD_LABELS,
  PROPERTY_PRICE_PERIODS,
  PROPERTY_TYPE_LABELS,
  propertyFormSchema,
  type LDCPropertyFormValues,
} from "@/validations/admin-catalog-schema";
import { LDCOwnerPropertyForm, type LDCOwnerPropertyFormProps } from "./ldc-owner-property-form";

/** Formulario del admin (`/dashboard/admin/propiedades`, CLGDC-126): se publica al guardar. */
export interface LDCAdminPropertyFormProps {
  variant?: "admin";
  mode: "create" | "edit";
  /** Server action que guarda (en edición, ya ligada al id con `.bind`) */
  action: (values: LDCPropertyFormValues) => Promise<IDashboardActionResult>;
  /** Ruta a la que vuelve tras guardar */
  returnHref: string;
  initial: LDCPropertyFormValues;
  /** Ciudades para el combobox */
  cities: { id: string; name: string; slug: string }[];
  /**
   * Estado de publicación de la propiedad que se edita (CLGDC-164): guardar no lo cambia, así que
   * la nota del pie dice qué pasa con los cambios según el estado. Sin él (crear), se publica.
   */
  status?: IAdminProperty["status"];
}

/** Nota del pie del admin: guardar no cambia el estado (CLGDC-164); dice dónde se verán los cambios. */
function adminSaveNote(isCreate: boolean, status: IAdminProperty["status"]): ReactNode {
  if (isCreate) {
    return (
      <>
        <b>Se publica al guardar.</b> La propiedad se ve en el sitio enseguida.
      </>
    );
  }
  switch (status) {
    case "REVIEW":
      return (
        <>
          <b>Sigue en revisión.</b> Guardar no la publica: apruébala en Moderación o en el listado.
        </>
      );
    case "REJECTED":
      return (
        <>
          <b>Sigue rechazada.</b> Guardar no la publica: cambia su estado desde el listado.
        </>
      );
    case "ARCHIVED":
      return (
        <>
          <b>Su dueño la archivó.</b> Guardar no la publica; solo el dueño puede desarchivarla.
        </>
      );
    case "EXPIRED":
      return (
        <>
          <b>No está publicada.</b> Guardar no la publica: cambia su estado desde el listado.
        </>
      );
    default:
      return (
        <>
          <b>Está publicada.</b> Los cambios se ven en el sitio enseguida.
        </>
      );
  }
}

export type LDCPropertyFormProps = LDCAdminPropertyFormProps | LDCOwnerPropertyFormProps;

/** Opciones de un enum para `LDCCombobox` (el `slug` es el valor de la API). */
const options = <K extends string>(keys: readonly K[], labels: Record<K, string>) =>
  keys.map((k) => ({ id: k, name: labels[k], slug: k }));

const TYPE_OPTIONS = options(PROPERTY_TYPES, PROPERTY_TYPE_LABELS);
const OPERATION_OPTIONS = options(PROPERTY_OPERATIONS, PROPERTY_OPERATION_LABELS);
const CURRENCY_OPTIONS = options(PROPERTY_CURRENCIES, PROPERTY_CURRENCY_LABELS);
const PERIOD_OPTIONS = [
  { id: "sin-periodo", name: "Sin periodo", slug: "" },
  ...options(PROPERTY_PRICE_PERIODS, PROPERTY_PRICE_PERIOD_LABELS),
];

const COMBOBOX_CLASS = "h-10 bg-transparent font-normal dark:bg-input/30";

/** Sección del formulario: `LDCDashboardCard` con bajada opcional (como en `LDCListingForm`). */
function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <LDCDashboardCard id={id} title={title} description={sub} className="scroll-mt-20">
      <div className="flex flex-col gap-6">{children}</div>
    </LDCDashboardCard>
  );
}

/**
 * LDCPropertyForm - Alta y edición de una propiedad en página propia (CLGDC-126)
 *
 * Dos variantes: la del admin (por defecto, la que sigue) y la del dueño (`variant="owner"`,
 * CLGDC-164, en `ldc-owner-property-form.tsx`), que pasa por moderación.
 *
 * Secciones Datos (título, slug, tipo, operación, descripción y marcas), Precio y superficie,
 * Ubicación (ciudad con `LDCCombobox`, dirección, comuna y barrio), Imágenes (`LDCImageUpload` y
 * `LDCImageGallery`, suben a MinIO) y Contacto del corredor, con `LDCFormField` y el pie fijo
 * `LDCFormSaveBar`. Los números se escriben como texto («1500,5»); la server action devuelve
 * `{ ok, message }` y al guardar vuelve al listado.
 */
export function LDCPropertyForm(props: LDCPropertyFormProps) {
  return props.variant === "owner" ? <LDCOwnerPropertyForm {...props} /> : <AdminPropertyForm {...props} />;
}

function AdminPropertyForm({ mode, action, returnHref, initial, cities, status }: LDCAdminPropertyFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [imageBusy, setImageBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const form = useForm<LDCPropertyFormValues>({
    resolver: zodResolver(propertyFormSchema) as Resolver<LDCPropertyFormValues>,
    defaultValues: initial,
    mode: "onTouched",
  });
  const { control, formState } = form;
  const isCreate = mode === "create";
  const busy = imageBusy || galleryBusy;
  const title = () => form.getValues("title") || "la propiedad";

  function onSubmit(values: LDCPropertyFormValues) {
    startSaving(async () => {
      const result = await action(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(isCreate ? "Propiedad creada" : "Propiedad actualizada");
      router.push(returnHref);
      router.refresh();
    });
  }

  /** Combobox de un enum o de las ciudades: guarda el `slug` de la opción como valor. */
  const select = (
    items: { id: string; name: string; slug: string }[],
    texts: { placeholder: string; search: string; empty: string },
    toValue: (slug: string) => string = (slug) => slug,
    fromValue: (value: string) => string = (value) => value,
  ) =>
    function PropertySelect({
      field,
      id,
      invalid,
      describedBy,
      disabled,
    }: LDCFormFieldRenderProps<LDCPropertyFormValues>) {
      return (
        <LDCCombobox
          id={id}
          items={items}
          value={fromValue(String(field.value ?? ""))}
          onValueChange={(slug) => {
            field.onChange(toValue(slug));
            field.onBlur();
          }}
          placeholder={texts.placeholder}
          searchPlaceholder={texts.search}
          emptyText={texts.empty}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          disabled={disabled || saving}
          className={COMBOBOX_CLASS}
        />
      );
    };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => toast.error("Revisa los campos marcados en rojo."))}
      noValidate
    >
      <div className="flex max-w-3xl flex-col gap-4">
        <Section id="propiedad-datos" title="Datos">
          <LDCFormField control={control} name="title" label="Título" required disabled={saving} />
          <LDCFormField
            control={control}
            name="slug"
            label="Slug"
            placeholder="casa-mediterranea-lo-barnechea"
            description="Identificador único en la URL (minúsculas, números y guiones)."
            required
            disabled={saving}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField
              control={control}
              name="type"
              label="Tipo"
              required
              render={select(TYPE_OPTIONS, {
                placeholder: "Elige el tipo",
                search: "Buscar tipo…",
                empty: "No encontramos ese tipo.",
              })}
            />
            <LDCFormField
              control={control}
              name="operation"
              label="Operación"
              required
              render={select(OPERATION_OPTIONS, {
                placeholder: "Elige la operación",
                search: "Buscar operación…",
                empty: "No encontramos esa operación.",
              })}
            />
          </div>
          <LDCFormField
            control={control}
            name="description"
            label="Descripción"
            type="textarea"
            rows={6}
            optional
            disabled={saving}
          />
          <div className="grid gap-3">
            <LDCCheckboxField control={control} name="featured" label="Destacada" disabled={saving} />
            <LDCCheckboxField control={control} name="isNew" label="Proyecto nuevo" disabled={saving} />
          </div>
        </Section>

        <Section id="propiedad-precio" title="Precio y superficie">
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField
              control={control}
              name="priceAmount"
              label="Precio"
              inputMode="decimal"
              placeholder="28000"
              required
              disabled={saving}
            />
            <LDCFormField
              control={control}
              name="priceCurrency"
              label="Moneda"
              required
              render={select(CURRENCY_OPTIONS, {
                placeholder: "Elige la moneda",
                search: "Buscar moneda…",
                empty: "No encontramos esa moneda.",
              })}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField
              control={control}
              name="priceCommonExpenses"
              label="Gastos comunes"
              inputMode="decimal"
              optional
              disabled={saving}
            />
            <LDCFormField
              control={control}
              name="pricePeriod"
              label="Periodo del precio"
              optional
              description="Solo en arriendos."
              render={select(PERIOD_OPTIONS, {
                placeholder: "Sin periodo",
                search: "Buscar periodo…",
                empty: "No encontramos ese periodo.",
              })}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField
              control={control}
              name="surface"
              label="Superficie útil (m²)"
              inputMode="decimal"
              required
              disabled={saving}
            />
            <LDCFormField
              control={control}
              name="totalSurface"
              label="Superficie total (m²)"
              inputMode="decimal"
              optional
              disabled={saving}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <LDCFormField control={control} name="bedrooms" label="Dormitorios" inputMode="numeric" optional disabled={saving} />
            <LDCFormField control={control} name="bathrooms" label="Baños" inputMode="numeric" optional disabled={saving} />
            <LDCFormField control={control} name="parking" label="Estacionamientos" inputMode="numeric" optional disabled={saving} />
          </div>
        </Section>

        <Section id="propiedad-ubicacion" title="Ubicación">
          <LDCFormField
            control={control}
            name="cityId"
            label="Ciudad"
            required
            description={`${cities.length} ciudades; escribe para buscar.`}
            render={select(
              cities,
              { placeholder: "Elige una ciudad", search: "Buscar ciudad…", empty: "No encontramos esa ciudad." },
              (slug) => cities.find((c) => c.slug === slug)?.id ?? "",
              (id) => cities.find((c) => c.id === id)?.slug ?? "",
            )}
          />
          <LDCFormField
            control={control}
            name="location"
            label="Ubicación"
            placeholder="Lo Barnechea, La Dehesa"
            description="El texto de ubicación que se ve en la tarjeta."
            required
            disabled={saving}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField control={control} name="commune" label="Comuna" optional disabled={saving} />
            <LDCFormField control={control} name="neighborhood" label="Barrio o sector" optional disabled={saving} />
          </div>
        </Section>

        <Section id="propiedad-imagenes" title="Imágenes">
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
                alt={`Imagen principal de ${title()}`}
                hint="Se ve en la tarjeta de la propiedad. JPG, PNG o WebP, hasta 5 MB. Mejor en horizontal (4:3)."
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
            description={`Hasta ${PROPERTY_GALLERY_MAX} fotos. Cambia el orden con las flechas o arrastrando.`}
            render={({ field, id, describedBy, disabled, setLocalError }) => (
              <LDCImageGallery
                id={id}
                value={field.value}
                onChange={(urls) => field.onChange(urls)}
                onError={setLocalError}
                onBusyChange={setGalleryBusy}
                max={Math.max(PROPERTY_GALLERY_MAX, initial.gallery.length)}
                title={title()}
                describedBy={describedBy}
                disabled={disabled || saving}
              />
            )}
          />
        </Section>

        <Section id="propiedad-contacto" title="Contacto del corredor">
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField control={control} name="agentName" label="Nombre" optional autoComplete="off" disabled={saving} />
            <LDCFormField control={control} name="agentAgency" label="Corredora" optional disabled={saving} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <LDCFormField control={control} name="agentPhone" label="Teléfono" type="tel" optional icon={<Phone />} disabled={saving} />
            <LDCFormField control={control} name="agentWhatsapp" label="WhatsApp" type="tel" optional icon={<FaWhatsapp />} disabled={saving} />
          </div>
          <LDCFormField control={control} name="agentEmail" label="Email" type="email" optional icon={<Mail />} disabled={saving} />
        </Section>
      </div>

      <LDCFormSaveBar
        className="mt-6"
        note={
          busy ? (
            <b>Espera a que terminen de subir las fotos para guardar.</b>
          ) : (
            adminSaveNote(isCreate, status)
          )
        }
        submitText={isCreate ? "Crear propiedad" : "Guardar cambios"}
        saving={saving}
        submitDisabled={busy || saving || (!isCreate && !formState.isDirty)}
        discardDisabled={!formState.isDirty}
        onDiscard={() => form.reset(initial)}
      />
    </form>
  );
}
