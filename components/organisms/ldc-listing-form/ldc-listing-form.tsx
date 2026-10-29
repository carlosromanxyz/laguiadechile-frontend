"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Info, Mail, MapPin, Phone, Save, Send } from "lucide-react";
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
import { LDCListingCard } from "@/components/molecules/ldc-listing-card";
import { LDCListingTypeSelector } from "@/components/molecules/ldc-listing-type-selector";
import { LDCScheduleField } from "@/components/molecules/ldc-schedule-field";
import { LDC_STATUS_COPY, LDCStatusNotice } from "@/components/molecules/ldc-status-notice";
import { LDCListingPreviewDialog } from "@/components/organisms/ldc-listing-preview-dialog";
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
import type { IListingCategory, IListingCity, IListingDetail } from "@/interfaces/listing";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import type {
  ICreateMyListingResult,
  IMyListing,
  IMyListingCreate,
  IMyListingUpdate,
  IUpdateMyListingResult,
} from "@/interfaces/my-listing";
import { descriptionHtmlToText, descriptionTextToHtml } from "@/lib/format/description";
import { scheduleFromApi, scheduleToApi } from "@/lib/format/schedule";
import {
  GALLERY_MAX,
  listingFormSchema,
  type LDCListingFormValues,
} from "@/validations/listing-form-schema";

interface LDCListingFormBaseProps {
  /** Categorías para el combobox */
  categories: IListingCategory[];
  /** Ciudades para el combobox */
  cities: IListingCity[];
}

/** Editar una ficha existente (`/dashboard/comercio/ficha`). */
interface LDCListingFormEditProps extends LDCListingFormBaseProps {
  mode?: "edit";
  /** Ficha propia, tal como la devuelve `GET /me/listings` */
  listing: IMyListing;
  /** Server action que guarda (`PATCH /me/listings/:id`); deja la ficha en `REVIEW` */
  action: (id: string, input: IMyListingUpdate) => Promise<IUpdateMyListingResult>;
}

/** Crear una ficha nueva (`/dashboard/publicar`): sin estado previo y con selector Comercio | Servicio. */
interface LDCListingFormCreateProps extends LDCListingFormBaseProps {
  mode: "create";
  /** Tipo elegido al abrir el formulario */
  defaultType?: IListingDetail["type"];
  /** Server action que crea (`POST /me/listings`); la ficha nace en `REVIEW` */
  action: (input: IMyListingCreate) => Promise<ICreateMyListingResult>;
  /** Adónde ir después de crearla */
  successHref: string;
}

export type LDCListingFormProps = LDCListingFormEditProps | LDCListingFormCreateProps;

const dateFormat = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  timeZone: "America/Santiago",
});

function toValues(l: IMyListing): LDCListingFormValues {
  return {
    title: l.title,
    categoryId: l.category.id,
    cityId: l.city.id,
    description: descriptionHtmlToText(l.description),
    address: l.address ?? "",
    commune: l.commune ?? "",
    image: l.image,
    gallery: l.gallery,
    phone: l.contact.phone ?? "",
    whatsapp: l.contact.whatsapp ?? "",
    email: l.contact.email ?? "",
    website: l.contact.website ?? "",
    schedule: scheduleFromApi(l.schedule),
  };
}

/** Ficha en blanco para el modo crear: da los valores iniciales y la base de la vista previa. */
function blankListing(type: IListingDetail["type"]): IMyListing {
  const now = new Date().toISOString();
  return {
    id: "",
    title: "",
    slug: "",
    type,
    category: { id: "", name: "Categoría", slug: "", icon: "" },
    city: { id: "", name: "Ciudad", slug: "" },
    image: "",
    featured: false,
    createdAt: now,
    updatedAt: now,
    description: "",
    contact: {},
    socialMedia: {},
    gallery: [],
    status: "review",
  };
}

const orNull = (v: string) => (v.trim() ? v.trim() : null);

function toPayload(v: LDCListingFormValues): IMyListingUpdate {
  return {
    title: v.title.trim(),
    description: descriptionTextToHtml(v.description),
    image: v.image,
    gallery: v.gallery,
    categoryId: v.categoryId,
    cityId: v.cityId,
    address: orNull(v.address),
    commune: orNull(v.commune),
    phone: orNull(v.phone),
    whatsapp: orNull(v.whatsapp),
    email: orNull(v.email),
    website: orNull(v.website),
    schedule: scheduleToApi(v.schedule),
  };
}

/** Texto bajo el estado: qué significa y qué pasa si guardas. */
function statusText(status: IDashboardPublicationStatus, updatedAt: string): ReactNode {
  switch (status) {
    case "published":
      return "Si cambias algo, la revisamos antes de volver a publicarla.";
    case "review":
      return `Enviaste los cambios el ${dateFormat.format(new Date(updatedAt))}. Mientras los revisamos, tu ficha no aparece en la guía. Puedes seguir editándola.`;
    case "rejected":
      return (
        <>
          Revisa los datos y las fotos y vuelve a enviarla. Si tienes dudas,{" "}
          <Link href="/contacto" className="font-semibold text-pink underline-offset-2 hover:underline dark:text-yellow">
            escríbenos
          </Link>
          .
        </>
      );
    case "expired":
      return "Guárdala de nuevo para enviarla a revisión y volver a publicarla.";
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
 * LDCListingForm - Ficha del comercio: formulario + vista previa (alternativa B del lienzo)
 *
 * Secciones Datos, Ubicación, Imágenes, Contacto y Horario a la izquierda; desde `lg`, a la
 * derecha y fija, el estado de moderación con el botón de guardar y la tarjeta de vista previa
 * (`LDCListingCard` con los valores actuales). En móvil, el estado va arriba, la vista previa al
 * final y el guardado en una barra fija. «Ver detalles» de la tarjeta abre la vista de detalle
 * completa en un modal. Al guardar, la ficha pasa a revisión y sale de la guía hasta que se
 * apruebe; los avisos lo dicen antes de guardar.
 *
 * Con `mode="create"` (`/dashboard/publicar`) parte en blanco, suma el selector Comercio | Servicio
 * arriba de «Datos del negocio», no muestra estado previo y el CTA dice «Enviar a revisión». Al
 * crearla, avisa con un toast y navega a `successHref`.
 */
export function LDCListingForm(props: LDCListingFormProps) {
  const { categories, cities } = props;
  const isCreate = props.mode === "create";
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [type, setType] = useState<IListingDetail["type"]>(
    props.mode === "create" ? (props.defaultType ?? "comercio") : props.listing.type,
  );
  const [blank] = useState(() => blankListing(type));
  const [saved, setSaved] = useState(props.mode === "create" ? undefined : props.listing);
  const current = useMemo(() => saved ?? { ...blank, type }, [saved, blank, type]);
  const [imageBusy, setImageBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const defaults = useMemo(() => toValues(current), [current]);
  const form = useForm<LDCListingFormValues>({
    resolver: zodResolver(listingFormSchema) as Resolver<LDCListingFormValues>,
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { control, formState } = form;
  const values = useWatch({ control }) as LDCListingFormValues;

  const status = current.status;
  const busy = imageBusy || galleryBusy;
  const dirty = formState.isDirty;
  const canSubmit =
    !busy && !saving && (isCreate || dirty || status === "rejected" || status === "expired");

  const categoryItems = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon || undefined })),
    [categories],
  );
  const category = categories.find((c) => c.id === values.categoryId) ?? current.category;
  const city = cities.find((c) => c.id === values.cityId) ?? current.city;

  const preview: IListingDetail = {
    id: current.id,
    title: values.title?.trim() || current.title || "Nombre de tu negocio",
    slug: current.slug,
    type: current.type,
    category,
    city,
    image: values.image || current.image,
    featured: current.featured,
    createdAt: current.createdAt,
    updatedAt: current.updatedAt,
    description: "",
    address: values.address?.trim() || undefined,
    commune: values.commune?.trim() || undefined,
    contact: {
      phone: values.phone?.trim() || undefined,
      whatsapp: values.whatsapp?.trim() || undefined,
      email: values.email?.trim() || undefined,
      website: values.website?.trim() || undefined,
    },
    socialMedia: current.socialMedia,
    schedule: values.schedule ? (scheduleToApi(values.schedule) ?? undefined) : undefined,
    gallery: values.gallery ?? [],
  };

  function onSubmit(v: LDCListingFormValues) {
    if (props.mode === "create") {
      const { action, successHref } = props;
      startSaving(async () => {
        const result = await action({ ...toPayload(v), type });
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        toast.success("Enviamos tu ficha a revisión", {
          description: "Mientras la revisamos, la verás en tu panel como «En revisión».",
        });
        router.push(successHref);
      });
      return;
    }
    const { action } = props;
    startSaving(async () => {
      const result = await action(current.id, toPayload(v));
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setSaved(result.listing);
      form.reset(toValues(result.listing));
      toast.success("Enviamos tu ficha a revisión", {
        description: "Mientras la revisamos, no aparece en la guía.",
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
  const saveNote = isCreate ? (
    <>
      <b>Revisamos cada ficha antes de publicarla.</b> Mientras tanto, no aparece en la guía.
    </>
  ) : status === "review" ? (
      <>
        <b>Tu ficha ya está en revisión.</b> Si guardas de nuevo, revisamos la versión más reciente.
      </>
    ) : (
      <>
        <b>Al guardar, tu ficha pasa a revisión.</b> Mientras la revisamos, no aparece en la guía.
      </>
    );

  const previewPanel = (id: string) => (
    <LDCDashboardCard
      id={id}
      title="Vista previa"
      description="Así se ve tu tarjeta en la guía. «Ver detalles» abre la ficha completa."
    >
      <LDCListingCard
        title={preview.title}
        slug={preview.slug}
        type={preview.type}
        category={{ name: category.name, slug: category.slug, icon: category.icon }}
        city={{ name: city.name, slug: city.slug }}
        image={preview.image}
        featured={preview.featured}
        createdAt={preview.createdAt}
        updatedAt={preview.updatedAt}
        onDetailsClick={() => setPreviewOpen(true)}
      />
    </LDCDashboardCard>
  );

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-4">
            {!isCreate && (
              <LDCStatusNotice status={status} className="lg:hidden">
                {statusText(status, current.updatedAt)}
              </LDCStatusNotice>
            )}

            <Section id="ficha-datos" title="Datos del negocio">
              {isCreate && (
                <LDCListingTypeSelector value={type} onChange={setType} disabled={saving} />
              )}
              <LDCFormField control={control} name="title" label="Nombre del negocio" autoComplete="organization" />
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField
                  control={control}
                  name="categoryId"
                  label="Categoría"
                  render={({ field, id, invalid, describedBy, disabled }) => (
                    <LDCCombobox
                      id={id}
                      items={categoryItems}
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
                      disabled={disabled}
                      className="h-10 bg-transparent font-normal dark:bg-input/30"
                    />
                  )}
                />
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
                      disabled={disabled}
                      className="h-10 bg-transparent font-normal dark:bg-input/30"
                    />
                  )}
                />
              </div>
              <LDCFormField
                control={control}
                name="description"
                label="Descripción"
                type="textarea"
                rows={7}
                description="Cuenta qué ofreces. Separa los párrafos con una línea en blanco."
              />
            </Section>

            <Section id="ficha-ubicacion" title="Ubicación">
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField
                  control={control}
                  name="address"
                  label="Dirección"
                  optional
                  autoComplete="street-address"
                  icon={<MapPin />}
                />
                <LDCFormField control={control} name="commune" label="Comuna" optional />
              </div>
            </Section>

            <Section id="ficha-imagenes" title="Imágenes">
              <LDCFormField
                control={control}
                name="image"
                label="Imagen principal"
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
                    alt={`Imagen principal de ${preview.title}`}
                    hint="Se ve en tu tarjeta de la guía. JPG, PNG o WebP, hasta 5 MB. Mejor en horizontal (4:3)."
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
                description={
                  values.gallery?.length
                    ? `Hasta ${GALLERY_MAX} fotos. Cambia el orden con las flechas o arrastrando.`
                    : `Hasta ${GALLERY_MAX} fotos. La primera aparece después de la imagen principal.`
                }
                render={({ field, id, describedBy, disabled, setLocalError }) => (
                  <LDCImageGallery
                    id={id}
                    value={field.value}
                    onChange={(urls) => field.onChange(urls)}
                    onError={setLocalError}
                    onBusyChange={setGalleryBusy}
                    max={Math.max(GALLERY_MAX, current.gallery.length)}
                    title={preview.title}
                    describedBy={describedBy}
                    disabled={disabled || saving}
                  />
                )}
              />
            </Section>

            <Section
              id="ficha-contacto"
              title="Contacto"
              sub="Lo que se muestra en tu ficha. Los clics a WhatsApp, llamadas y web se cuentan en Estadísticas."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="phone" label="Teléfono" type="tel" optional autoComplete="tel" icon={<Phone />} />
                <LDCFormField control={control} name="whatsapp" label="WhatsApp" type="tel" optional icon={<FaWhatsapp />} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="email" label="Email" type="email" optional autoComplete="email" icon={<Mail />} />
                <LDCFormField
                  control={control}
                  name="website"
                  label="Sitio web"
                  type="url"
                  optional
                  placeholder="https://"
                  autoComplete="url"
                  icon={<Globe />}
                />
              </div>
            </Section>

            <Section id="horario" title="Horario">
              <LDCScheduleField
                id="ldc-schedule"
                value={values.schedule}
                onChange={(next) => form.setValue("schedule", next, { shouldDirty: true, shouldValidate: formState.isSubmitted })}
                errors={formState.errors.schedule as never}
                disabled={saving}
              />
            </Section>

            <div className="lg:hidden">{previewPanel("ldc-ficha-vista-previa-movil")}</div>
          </div>

          <aside className="sticky top-20 hidden flex-col gap-4 lg:flex" aria-label="Estado y vista previa">
            <LDCDashboardCard
              id="ldc-ficha-estado"
              title={isCreate ? "Tu ficha nueva" : "Estado de tu ficha"}
              action={
                isCreate ? undefined : (
                  <LDCBadge variant={LDC_STATUS_COPY[status].badge}>{LDC_STATUS_COPY[status].label}</LDCBadge>
                )
              }
            >
              <p className="-mt-1 mb-4 font-open-sans text-sm text-muted-foreground" role="status">
                {isCreate
                  ? "Cuando la envíes, la revisamos antes de publicarla en la guía."
                  : statusText(status, current.updatedAt)}
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
              <p className="mt-2.5 flex gap-1.5 font-open-sans text-xs text-muted-foreground">
                <Info className="mt-px size-3.5 shrink-0 text-orange dark:text-yellow" aria-hidden />
                <span>
                  {busy
                    ? "Espera a que terminen de subir las fotos para guardar."
                    : isCreate
                      ? "No aparece en la guía hasta que la aprobemos."
                      : "Al guardar, tu ficha pasa a revisión y no aparece en la guía hasta que la aprobemos."}
                </span>
              </p>
              <Button type="button" variant="ghost" className="mt-2 w-full" onClick={discard} disabled={!dirty || saving}>
                Descartar cambios
              </Button>
            </LDCDashboardCard>
            {previewPanel("ldc-ficha-vista-previa")}
          </aside>
        </div>

        <LDCFormSaveBar
          className="mt-6 lg:hidden"
          note={busy ? <b>Espera a que terminen de subir las fotos para guardar.</b> : saveNote}
          submitText={submitText}
          savingText={isCreate ? "Enviando…" : undefined}
          saving={saving}
          submitDisabled={!canSubmit}
          discardDisabled={!dirty}
          onDiscard={discard}
        />
      </form>

      <LDCListingPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        listing={preview}
        descriptionText={values.description ?? ""}
      />

      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar los cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              {isCreate
                ? "Se borra todo lo que escribiste. Las fotos que subiste no se usarán."
                : "Tu ficha vuelve a como estaba la última vez que la guardaste. Las fotos que subiste y no guardaste no se usarán."}
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
