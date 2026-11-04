"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bath, Bed, Car, ImageOff, Info, Mail, Maximize, Phone, Save, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDCFormSaveBar } from "@/components/molecules/ldc-form-save-bar";
import { LDCImageGallery } from "@/components/molecules/ldc-image-gallery";
import { LDCImageUpload } from "@/components/molecules/ldc-image-upload";
import { LDCSegmentedField } from "@/components/molecules/ldc-segmented-field";
import { LDC_STATUS_COPY, LDCStatusNotice } from "@/components/molecules/ldc-status-notice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  PROPERTY_CURRENCIES,
  PROPERTY_OPERATIONS,
  PROPERTY_TYPES,
  type IAdminPropertyOperation,
  type IAdminPropertyType,
} from "@/interfaces/admin-catalog";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import type { IMyProperty, IMyPropertyResult } from "@/interfaces/my-property";
import type { PropertyOperation, PropertyType } from "@/interfaces/property";
import {
  formatCommonExpenses,
  formatPropertyPriceWithPeriod,
  getOperationLabel,
  getPropertyRooms,
  getPropertyTypeLabel,
} from "@/lib/format/properties";
import {
  isRentOperation,
  myPropertyFormSchema,
  parseDecimal,
  PROPERTY_CURRENCY_LABELS,
  PROPERTY_GALLERY_MAX,
  PROPERTY_OPERATION_LABELS,
  PROPERTY_PRICE_PERIOD_LABELS,
  PROPERTY_PRICE_PERIODS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES_WITH_BEDROOMS,
  PROPERTY_TYPES_WITH_BUILDING,
  propertyToValues,
  type LDCPropertyFormValues,
} from "@/validations/admin-catalog-schema";

interface LDCOwnerPropertyFormBaseProps {
  variant: "owner";
  /** Ciudades para el combobox */
  cities: { id: string; name: string; slug: string }[];
}

/** Editar una propiedad propia (`/dashboard/propiedades/[id]`). */
interface LDCOwnerPropertyFormEditProps extends LDCOwnerPropertyFormBaseProps {
  mode: "edit";
  /** Propiedad propia, tal como la devuelve `GET /me/properties` */
  property: IMyProperty;
  /** Server action que guarda (`PATCH /me/properties/:id`); deja la propiedad en `REVIEW` */
  action: (id: string, values: LDCPropertyFormValues) => Promise<IMyPropertyResult>;
}

/** Crear una propiedad (`/dashboard/propiedades/nueva`): en blanco, con el contacto del perfil. */
interface LDCOwnerPropertyFormCreateProps extends LDCOwnerPropertyFormBaseProps {
  mode: "create";
  /** Contacto precargado desde el perfil (nombre y correo de la cuenta) */
  defaultContact: { name: string; email: string };
  /** Server action que crea (`POST /me/properties`); la propiedad nace en `REVIEW` */
  action: (values: LDCPropertyFormValues) => Promise<IMyPropertyResult>;
  /** Adónde ir después de crearla */
  successHref: string;
}

export type LDCOwnerPropertyFormProps = LDCOwnerPropertyFormEditProps | LDCOwnerPropertyFormCreateProps;

/** Título y etiqueta de cada estado, en femenino (la propiedad); la insignia sale de `LDC_STATUS_COPY`. */
const STATUS_COPY: Record<IDashboardPublicationStatus, { title: string; label: string }> = {
  published: { title: "Tu propiedad se ve en La Guía", label: "Publicada" },
  review: { title: "Estamos revisando tu propiedad", label: "En revisión" },
  rejected: { title: "No pudimos aprobar tu propiedad", label: "Rechazada" },
  expired: { title: "Tu propiedad no está publicada", label: "Vencida" },
  archived: { title: "Tu propiedad está archivada", label: "Archivada" },
};

const OPERATION_OPTIONS = PROPERTY_OPERATIONS.map((value) => ({ value, label: PROPERTY_OPERATION_LABELS[value] }));
const TYPE_OPTIONS = PROPERTY_TYPES.map((value) => ({ value, label: PROPERTY_TYPE_LABELS[value] }));
const CURRENCY_OPTIONS = PROPERTY_CURRENCIES.map((value) => ({ value, label: PROPERTY_CURRENCY_LABELS[value] }));
const PERIOD_OPTIONS = [
  { value: "" as const, label: "Sin periodo" },
  ...PROPERTY_PRICE_PERIODS.map((value) => ({ value, label: PROPERTY_PRICE_PERIOD_LABELS[value] })),
];

/** `DEPARTAMENTO` → `departamento`, `ARRIENDO_TEMPORAL` → `arriendo-temporal` (los helpers públicos). */
const toPublicType = (t: IAdminPropertyType) => t.toLowerCase() as PropertyType;
const toPublicOperation = (o: IAdminPropertyOperation) => o.toLowerCase().replace("_", "-") as PropertyOperation;

/** Número del formulario («1500,5») para la vista previa; `undefined` si está vacío o no es número. */
function previewNumber(value: string | undefined): number | undefined {
  const n = parseDecimal(value ?? "");
  return Number.isFinite(n) ? n : undefined;
}

/** Propiedad en blanco del modo crear: departamento en venta, en UF, con el contacto del perfil. */
function blankValues(contact: { name: string; email: string }): LDCPropertyFormValues {
  return {
    ...propertyToValues(),
    type: "DEPARTAMENTO",
    operation: "VENTA",
    agentName: contact.name,
    agentEmail: contact.email,
  };
}

/** Texto bajo el estado: qué significa y qué pasa si guardas. */
function statusText(status: IDashboardPublicationStatus): ReactNode {
  switch (status) {
    case "published":
      return "Si cambias algo, la revisamos antes de volver a publicarla.";
    case "review":
      return "Mientras la revisamos, tu propiedad no aparece en La Guía. Puedes seguir editándola.";
    case "rejected":
      return (
        <>
          Corrige la propiedad y vuelve a enviarla. Si tienes dudas,{" "}
          <Link href="/contacto" className="font-semibold text-pink underline-offset-2 hover:underline dark:text-yellow">
            escríbenos
          </Link>
          .
        </>
      );
    case "expired":
      return "Guárdala de nuevo para enviarla a revisión.";
    case "archived":
      return "La archivaste y no aparece en La Guía. Si cambias algo, la enviamos a revisión.";
  }
}

/** Sección del formulario: `LDCDashboardCard` con id (ancla y `aria-labelledby`) y bajada opcional. */
function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <LDCDashboardCard id={id} title={title} description={sub} className="scroll-mt-20">
      <div className="flex flex-col gap-6">{children}</div>
    </LDCDashboardCard>
  );
}

/**
 * LDCOwnerPropertyForm - Propiedad del dueño: formulario + vista previa (alternativa A de CLGDC-164)
 *
 * Mismo formato que `LDCClassifiedForm` y `LDCListingForm`: tarjetas «Qué publicas», «Precio»,
 * «Características», «Ubicación», «Fotos» y «Contacto» a la izquierda; desde `lg`, a la derecha y
 * fija, la columna «Enviar» y la vista previa de la tarjeta. Los campos se adaptan al tipo y a la
 * operación con las mismas reglas de `getPropertyRooms`: un terreno solo pide superficie; oficina,
 * local y bodega no piden dormitorios; solo el arriendo pide periodo. Las fotos suben a MinIO con
 * `LDCImageUpload` y `LDCImageGallery`. El contacto exige al menos teléfono, WhatsApp o email.
 *
 * Al editar, el estado va arriba en `LDCStatusNotice`, con el motivo si fue rechazada. Guardar
 * siempre deja la propiedad en revisión. Se usa vía `LDCPropertyForm variant="owner"`.
 */
export function LDCOwnerPropertyForm(props: LDCOwnerPropertyFormProps) {
  const { cities } = props;
  const isCreate = props.mode === "create";
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [blank] = useState(() =>
    blankValues(props.mode === "create" ? props.defaultContact : { name: "", email: "" }),
  );
  const [saved, setSaved] = useState(props.mode === "edit" ? props.property : undefined);
  const [imageBusy, setImageBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const defaults = useMemo(() => (saved ? propertyToValues(saved) : blank), [saved, blank]);
  const form = useForm<LDCPropertyFormValues>({
    resolver: zodResolver(myPropertyFormSchema) as Resolver<LDCPropertyFormValues>,
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { control, formState } = form;
  const values = useWatch({ control }) as LDCPropertyFormValues;

  const status: IDashboardPublicationStatus = saved?.status ?? "review";
  const reason = status === "rejected" ? saved?.rejectionReason : undefined;
  const busy = imageBusy || galleryBusy;
  const dirty = formState.isDirty;
  const canSubmit = !busy && !saving && (isCreate || dirty || status === "rejected" || status === "archived");

  const type = values.type || "DEPARTAMENTO";
  const operation = values.operation || "VENTA";
  const hasBedrooms = PROPERTY_TYPES_WITH_BEDROOMS.includes(type);
  const hasBuilding = PROPERTY_TYPES_WITH_BUILDING.includes(type);
  const isRent = isRentOperation(operation);
  const previewTitle = values.title?.trim() || "Título de tu propiedad";
  const city = cities.find((c) => c.id === values.cityId);

  /** Cambia un campo de radios y lo marca como editado (valida si ya se intentó enviar). */
  const choiceOptions = { shouldDirty: true, shouldValidate: formState.isSubmitted } as const;

  function onSubmit(v: LDCPropertyFormValues) {
    if (props.mode === "create") {
      const { action, successHref } = props;
      startSaving(async () => {
        const result = await action(v);
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        toast.success("Enviamos tu propiedad a revisión", {
          description: "Mientras la revisamos, la verás en «Mis propiedades» como «En revisión».",
        });
        router.push(successHref);
      });
      return;
    }
    const { action, property } = props;
    startSaving(async () => {
      const result = await action(property.id, v);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setSaved(result.property);
      form.reset(propertyToValues(result.property));
      toast.success("Enviamos tu propiedad a revisión", {
        description: "Mientras la revisamos, no aparece en La Guía.",
      });
      router.refresh();
    });
  }

  function onInvalid() {
    toast.error("Revisa los campos marcados en rojo.");
  }

  function discard() {
    if (dirty) setConfirmDiscard(true);
  }

  const submitText = isCreate ? "Enviar a revisión" : "Guardar y enviar a revisión";
  const noteText = busy ? (
    <b>Espera a que terminen de subir las fotos para guardar.</b>
  ) : isCreate || status !== "review" ? (
    <>
      <b>Revisamos cada propiedad antes de publicarla.</b> Te avisamos aquí si hay que corregir algo.
    </>
  ) : (
    <>
      <b>Tu propiedad ya está en revisión.</b> Si guardas de nuevo, revisamos la versión más reciente.
    </>
  );

  // Vista previa: el precio, el tipo y las características con las reglas de la tarjeta pública.
  const amount = previewNumber(values.priceAmount);
  const price = {
    amount: amount ?? 0,
    currency: values.priceCurrency === "CLP" ? ("clp" as const) : ("uf" as const),
    period: isRent && values.pricePeriod ? values.pricePeriod : undefined,
  };
  const commonExpenses = hasBuilding ? formatCommonExpenses(previewNumber(values.priceCommonExpenses)) : "";
  const rooms = getPropertyRooms(toPublicType(type), {
    bedrooms: previewNumber(values.bedrooms),
    bathrooms: previewNumber(values.bathrooms),
    parking: previewNumber(values.parking),
  });
  const surface = previewNumber(values.surface);
  const place = [values.commune?.trim(), city?.name].filter(Boolean).join(", ");

  const previewPanel = (id: string) => (
    <LDCDashboardCard id={id} title="Vista previa" description="Así se lee tu propiedad en la lista.">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="relative aspect-[4/3] bg-muted">
          {values.image ? (
            <Image src={values.image} alt="" fill sizes="320px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-muted-foreground">
              <ImageOff className="size-6" aria-hidden />
            </span>
          )}
        </div>
        <div className="space-y-1 p-3">
          <p className="font-mulish text-lg font-bold text-foreground">
            {amount !== undefined && amount > 0 ? formatPropertyPriceWithPeriod(price) : "Precio por definir"}
          </p>
          {commonExpenses && <p className="text-xs text-muted-foreground">{commonExpenses}</p>}
          <p className="text-xs text-muted-foreground">
            {getPropertyTypeLabel(toPublicType(type))} en {getOperationLabel(toPublicOperation(operation))}
          </p>
          <p className="line-clamp-2 text-sm text-foreground">{previewTitle}</p>
          {place && <p className="text-xs text-muted-foreground">{place}</p>}
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
            {surface !== undefined && (
              <li className="flex items-center gap-1">
                <Maximize className="size-3" aria-hidden />
                {surface.toLocaleString("es-CL")} m²
              </li>
            )}
            {rooms.bedrooms !== undefined && (
              <li className="flex items-center gap-1">
                <Bed className="size-3" aria-hidden />
                {rooms.bedrooms} {rooms.bedrooms === 1 ? "dormitorio" : "dormitorios"}
              </li>
            )}
            {rooms.bathrooms !== undefined && (
              <li className="flex items-center gap-1">
                <Bath className="size-3" aria-hidden />
                {rooms.bathrooms} {rooms.bathrooms === 1 ? "baño" : "baños"}
              </li>
            )}
            {rooms.parking !== undefined && (
              <li className="flex items-center gap-1">
                <Car className="size-3" aria-hidden />
                {rooms.parking} estac.
              </li>
            )}
          </ul>
        </div>
      </div>
    </LDCDashboardCard>
  );

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-4">
            {!isCreate && (
              <LDCStatusNotice
                status={status}
                title={STATUS_COPY[status].title}
                badge={<LDCBadge variant={LDC_STATUS_COPY[status].badge}>{STATUS_COPY[status].label}</LDCBadge>}
                reason={reason}
              >
                {/* Un solo bloque: `AlertDescription` es grid y separaría el texto del enlace. */}
                <span>{statusText(status)}</span>
              </LDCStatusNotice>
            )}

            <Section id="propiedad-que" title="Qué publicas">
              <LDCSegmentedField
                legend="Operación"
                name="ldc-property-operation"
                options={OPERATION_OPTIONS}
                value={operation}
                onChange={(next) => {
                  if (!isRentOperation(next)) form.setValue("pricePeriod", "");
                  form.setValue("operation", next, choiceOptions);
                }}
                disabled={saving}
              />
              <LDCSegmentedField
                legend="Tipo"
                name="ldc-property-type"
                options={TYPE_OPTIONS}
                value={type}
                onChange={(next) => {
                  // Lo que deja de aplicar se vacía: así no queda un dato oculto que trabe el envío.
                  if (!PROPERTY_TYPES_WITH_BEDROOMS.includes(next)) form.setValue("bedrooms", "");
                  if (!PROPERTY_TYPES_WITH_BUILDING.includes(next)) {
                    for (const name of ["bathrooms", "parking", "totalSurface", "priceCommonExpenses"] as const) {
                      form.setValue(name, "");
                    }
                  }
                  form.setValue("type", next, choiceOptions);
                }}
                description="Los campos de abajo se ajustan al tipo: un terreno, por ejemplo, solo pide la superficie."
                disabled={saving}
              />
            </Section>

            <Section id="propiedad-datos" title="Título y descripción">
              <LDCFormField
                control={control}
                name="title"
                label="Título"
                maxLength={200}
                description="Lo que se lee primero en la lista: qué es y su dato clave."
                disabled={saving}
              />
              <LDCFormField
                control={control}
                name="description"
                label="Descripción"
                type="textarea"
                rows={6}
                optional
                maxLength={5000}
                description="Solo texto. Cuenta lo que no se ve en las fotos: orientación, vista, cercanías."
                disabled={saving}
              />
            </Section>

            <Section id="propiedad-precio" title="Precio">
              <LDCSegmentedField
                legend="Moneda"
                name="ldc-property-currency"
                options={CURRENCY_OPTIONS}
                value={values.priceCurrency || "UF"}
                onChange={(next) => form.setValue("priceCurrency", next, choiceOptions)}
                disabled={saving}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField
                  control={control}
                  name="priceAmount"
                  label={values.priceCurrency === "CLP" ? "Precio en pesos" : "Precio en UF"}
                  inputMode="decimal"
                  maxLength={16}
                  placeholder={values.priceCurrency === "CLP" ? "450000" : "4800"}
                  description="El valor total, sin puntos (decimales con coma)."
                  disabled={saving}
                />
                {hasBuilding && (
                  <LDCFormField
                    control={control}
                    name="priceCommonExpenses"
                    label="Gastos comunes"
                    inputMode="decimal"
                    maxLength={16}
                    optional
                    icon={<span className="text-sm font-semibold">$</span>}
                    description="En pesos, al mes."
                    disabled={saving}
                  />
                )}
              </div>
              {isRent && (
                <LDCSegmentedField
                  legend="Periodo del precio"
                  name="ldc-property-period"
                  options={PERIOD_OPTIONS}
                  value={values.pricePeriod ?? ""}
                  onChange={(next) => form.setValue("pricePeriod", next, choiceOptions)}
                  disabled={saving}
                />
              )}
            </Section>

            <Section id="propiedad-caracteristicas" title="Características">
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField
                  control={control}
                  name="surface"
                  label={type === "TERRENO" ? "Superficie (m²)" : "Superficie útil (m²)"}
                  inputMode="decimal"
                  maxLength={12}
                  disabled={saving}
                />
                {hasBuilding && (
                  <LDCFormField
                    control={control}
                    name="totalSurface"
                    label="Superficie total (m²)"
                    inputMode="decimal"
                    maxLength={12}
                    optional
                    disabled={saving}
                  />
                )}
              </div>
              {hasBuilding && (
                <div className="grid gap-6 sm:grid-cols-3">
                  {hasBedrooms && (
                    <LDCFormField control={control} name="bedrooms" label="Dormitorios" inputMode="numeric" maxLength={4} optional disabled={saving} />
                  )}
                  <LDCFormField control={control} name="bathrooms" label="Baños" inputMode="numeric" maxLength={4} optional disabled={saving} />
                  <LDCFormField control={control} name="parking" label="Estacionamientos" inputMode="numeric" maxLength={4} optional disabled={saving} />
                </div>
              )}
            </Section>

            <Section id="propiedad-ubicacion" title="Ubicación">
              <LDCFormField
                control={control}
                name="cityId"
                label="Ciudad"
                description={`${cities.length} ciudades; escribe para buscar.`}
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
              <LDCFormField
                control={control}
                name="location"
                label="Ubicación"
                maxLength={300}
                placeholder="Lo Barnechea, La Dehesa"
                description="El sector o la referencia que se ve en la propiedad. No hace falta la dirección exacta."
                disabled={saving}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="commune" label="Comuna" optional maxLength={100} disabled={saving} />
                <LDCFormField control={control} name="neighborhood" label="Barrio o sector" optional maxLength={100} disabled={saving} />
              </div>
            </Section>

            <Section id="propiedad-fotos" title="Fotos">
              <LDCFormField
                control={control}
                name="image"
                label="Foto principal"
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
                    alt={`Foto principal de ${previewTitle}`}
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
                    max={Math.max(PROPERTY_GALLERY_MAX, saved?.gallery.length ?? 0)}
                    title={previewTitle}
                    describedBy={describedBy}
                    disabled={disabled || saving}
                  />
                )}
              />
            </Section>

            <Section
              id="propiedad-contacto"
              title="Contacto"
              sub="Los tomamos de tu perfil y se muestran en la propiedad; puedes usar otros. Deja al menos un teléfono, WhatsApp o email."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="agentName" label="Nombre" optional autoComplete="name" maxLength={200} disabled={saving} />
                <LDCFormField
                  control={control}
                  name="agentAgency"
                  label="Corredora"
                  optional
                  maxLength={200}
                  description="Déjala vacía si publicas como dueño directo."
                  disabled={saving}
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="agentPhone" label="Teléfono" type="tel" optional autoComplete="tel" maxLength={40} icon={<Phone />} disabled={saving} />
                <LDCFormField control={control} name="agentWhatsapp" label="WhatsApp" type="tel" optional maxLength={40} icon={<FaWhatsapp />} disabled={saving} />
              </div>
              <LDCFormField
                control={control}
                name="agentEmail"
                label="Email"
                type="email"
                optional
                autoComplete="email"
                maxLength={200}
                icon={<Mail />}
                disabled={saving}
              />
            </Section>

            <div className="lg:hidden">{previewPanel("ldc-propiedad-vista-previa-movil")}</div>
          </div>

          <aside className="sticky top-20 hidden flex-col gap-4 lg:flex" aria-label="Enviar y vista previa">
            <LDCDashboardCard id="ldc-propiedad-enviar" title="Enviar">
              <p className="-mt-1 mb-3 flex gap-2 font-open-sans text-[13px] text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-orange dark:text-yellow" aria-hidden />
                <span>{noteText}</span>
              </p>
              <LDCCTAButton
                type="submit"
                text={submitText}
                loading={saving}
                loadingText={isCreate ? "Enviando…" : "Guardando…"}
                disabled={!canSubmit}
                icon={isCreate ? <Send className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
                className="h-10 w-full justify-center"
              />
              <Button type="button" variant="ghost" className="mt-1.5 w-full" onClick={discard} disabled={!dirty || saving}>
                Descartar
              </Button>
            </LDCDashboardCard>
            {previewPanel("ldc-propiedad-vista-previa")}
          </aside>
        </div>

        <LDCFormSaveBar
          className="mt-6 lg:hidden"
          note={noteText}
          submitText={submitText}
          savingText={isCreate ? "Enviando…" : undefined}
          saving={saving}
          submitDisabled={!canSubmit}
          discardDisabled={!dirty}
          onDiscard={discard}
        />
      </form>

      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar los cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              {isCreate
                ? "Se borra todo lo que escribiste. Las fotos que subiste no se usarán."
                : "Tu propiedad vuelve a como estaba la última vez que la guardaste. Las fotos que subiste y no guardaste no se usarán."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.reset(defaults);
                setConfirmDiscard(false);
              }}
            >
              Descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
