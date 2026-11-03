"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Mail, Phone, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCClassifiedCard } from "@/components/molecules/ldc-classified-card";
import { LDCClassifiedTypeSelector } from "@/components/molecules/ldc-classified-type-selector";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDCFormSaveBar } from "@/components/molecules/ldc-form-save-bar";
import { LDCImageGallery } from "@/components/molecules/ldc-image-gallery";
import { LDCImageUpload } from "@/components/molecules/ldc-image-upload";
import { LDCRejectionReasonDialog } from "@/components/molecules/ldc-rejection-reason-dialog";
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
import type { ClassifiedPriceType } from "@/interfaces/classified";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import type { IListingCategory, IListingCity } from "@/interfaces/listing";
import type { IMyClassified, IMyClassifiedInput, IMyClassifiedResult } from "@/interfaces/my-classified";
import { descriptionHtmlToText } from "@/lib/format/description";
import {
  classifiedFormSchema,
  parseClpAmount,
  type LDCClassifiedFormValues,
} from "@/validations/classified-form-schema";
import { GALLERY_MAX } from "@/validations/listing-form-schema";

interface LDCClassifiedFormBaseProps {
  /** Categorías para el combobox */
  categories: IListingCategory[];
  /** Ciudades para el combobox */
  cities: IListingCity[];
}

/** Editar un aviso propio (`/dashboard/avisos/[id]`). */
interface LDCClassifiedFormEditProps extends LDCClassifiedFormBaseProps {
  mode?: "edit";
  /** Aviso propio, tal como lo devuelve `GET /me/classifieds` */
  classified: IMyClassified;
  /** Server action que guarda (`PATCH /me/classifieds/:id`); deja el aviso en `REVIEW` */
  action: (id: string, input: IMyClassifiedInput) => Promise<IMyClassifiedResult>;
}

/** Crear un aviso (`/dashboard/avisos/nuevo`): en blanco, con el contacto tomado del perfil. */
interface LDCClassifiedFormCreateProps extends LDCClassifiedFormBaseProps {
  mode: "create";
  /** Contacto precargado desde el perfil (nombre y correo de la cuenta) */
  defaultContact: { name: string; email: string };
  /** Server action que crea (`POST /me/classifieds`); el aviso nace en `REVIEW` */
  action: (input: IMyClassifiedInput) => Promise<IMyClassifiedResult>;
  /** Adónde ir después de crearlo */
  successHref: string;
}

export type LDCClassifiedFormProps = LDCClassifiedFormEditProps | LDCClassifiedFormCreateProps;

/** Título y etiqueta de cada estado, en masculino (el aviso); la insignia sale de `LDC_STATUS_COPY`. */
const STATUS_COPY: Record<IDashboardPublicationStatus, { title: string; label: string }> = {
  published: { title: "Tu aviso se ve en La Guía", label: "Publicado" },
  review: { title: "Estamos revisando tu aviso", label: "En revisión" },
  rejected: { title: "No pudimos aprobar tu aviso", label: "Rechazado" },
  expired: { title: "Tu aviso venció", label: "Vencido" },
  archived: { title: "Tu aviso está archivado", label: "Archivado" },
};

const PRICE_OPTIONS: { value: ClassifiedPriceType; label: string }[] = [
  { value: "fixed", label: "Precio fijo" },
  { value: "negotiable", label: "A convenir" },
  { value: "free", label: "Gratis" },
  { value: "contact", label: "Consultar" },
];

const orNull = (v: string) => (v.trim() ? v.trim() : null);

function toValues(c: IMyClassified): LDCClassifiedFormValues {
  return {
    type: c.type,
    title: c.title,
    categoryId: c.category.id,
    cityId: c.city.id,
    commune: c.commune ?? "",
    description: /^\s*<p>/.test(c.description) ? descriptionHtmlToText(c.description) : c.description,
    priceType: c.price.type,
    priceAmount: c.price.type === "fixed" && c.price.amount ? String(c.price.amount) : "",
    image: c.image,
    gallery: c.gallery,
    sellerName: c.seller.name,
    sellerPhone: c.seller.phone ?? "",
    sellerWhatsapp: c.seller.whatsapp ?? "",
    sellerEmail: c.seller.email ?? "",
  };
}

/** Aviso en blanco para el modo crear: da los valores iniciales y la base de la vista previa. */
function blankClassified(contact: { name: string; email: string }): IMyClassified {
  const now = new Date().toISOString();
  return {
    id: "",
    title: "",
    slug: "",
    description: "",
    type: "vendo",
    category: { id: "", name: "Categoría", slug: "", icon: "" },
    city: { id: "", name: "Ciudad", slug: "" },
    image: "",
    price: { type: "fixed" },
    featured: false,
    createdAt: now,
    expiresAt: "",
    seller: { name: contact.name, email: contact.email || undefined },
    gallery: [],
    status: "review",
  };
}

function toPayload(v: LDCClassifiedFormValues): IMyClassifiedInput {
  return {
    type: v.type,
    title: v.title.trim(),
    description: v.description.replace(/\r\n?/g, "\n").trim(),
    categoryId: v.categoryId || null,
    cityId: v.cityId,
    commune: orNull(v.commune),
    priceType: v.priceType,
    priceAmount: v.priceType === "fixed" ? parseClpAmount(v.priceAmount) : null,
    image: v.image,
    gallery: v.gallery,
    sellerName: orNull(v.sellerName),
    sellerPhone: orNull(v.sellerPhone),
    sellerWhatsapp: orNull(v.sellerWhatsapp),
    sellerEmail: orNull(v.sellerEmail),
  };
}

/** Texto bajo el estado: qué significa y qué pasa si guardas. */
function statusText(status: IDashboardPublicationStatus, hasReason: boolean): ReactNode {
  switch (status) {
    case "published":
      return "Si cambias algo, lo revisamos antes de volver a publicarlo.";
    case "review":
      return "Mientras lo revisamos, tu aviso no aparece en La Guía. Puedes seguir editándolo.";
    case "rejected":
      return (
        <>
          {hasReason ? "Presiona «Rechazado» para ver el motivo. " : ""}Corrige el aviso y vuelve a
          enviarlo. Si tienes dudas,{" "}
          <Link href="/contacto" className="font-semibold text-pink underline-offset-2 hover:underline dark:text-yellow">
            escríbenos
          </Link>
          .
        </>
      );
    case "expired":
      return "Guárdalo de nuevo para enviarlo a revisión. Cuando lo aprobemos, vuelve a durar 30 días.";
    case "archived":
      return "Lo archivaste y no aparece en La Guía. Si cambias algo, lo enviamos a revisión.";
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
 * LDCClassifiedForm - Aviso clasificado: formulario + vista previa (diseño B1 de CLGDC-113)
 *
 * Mismo formato que `LDCListingForm`: tarjetas «Tu aviso», «Precio y ubicación», «Imágenes» y
 * «Contacto» a la izquierda; desde `lg`, a la derecha y fija, la columna «Enviar» (nota, botón y
 * «Descartar») y la vista previa en `LDCClassifiedCard`. En móvil, la vista previa va al final y el
 * guardado en una barra fija. La descripción se guarda como texto plano (como la pinta
 * `/aviso/[slug]`); el contacto exige al menos teléfono, WhatsApp o email.
 *
 * Con `mode="create"` parte en blanco con el contacto precargado del perfil y, al crear, avisa con
 * un toast y navega a `successHref`. Al editar, el estado va arriba en `LDCStatusNotice`; si fue
 * rechazado, la insignia «Rechazado» abre el motivo en un modal (`LDCRejectionReasonDialog`).
 * Guardar siempre deja el aviso en revisión.
 */
export function LDCClassifiedForm(props: LDCClassifiedFormProps) {
  const { categories, cities } = props;
  const isCreate = props.mode === "create";
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [blank] = useState(() =>
    blankClassified(props.mode === "create" ? props.defaultContact : { name: "", email: "" }),
  );
  const [saved, setSaved] = useState(props.mode === "create" ? undefined : props.classified);
  const current = saved ?? blank;
  const [imageBusy, setImageBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const defaults = useMemo(() => toValues(current), [current]);
  const form = useForm<LDCClassifiedFormValues>({
    resolver: zodResolver(classifiedFormSchema) as Resolver<LDCClassifiedFormValues>,
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { control, formState } = form;
  const values = useWatch({ control }) as LDCClassifiedFormValues;

  const status = current.status;
  const reason = status === "rejected" ? current.rejectionReason : undefined;
  const busy = imageBusy || galleryBusy;
  const dirty = formState.isDirty;
  const canSubmit = !busy && !saving && (isCreate || dirty || status === "rejected" || status === "expired");

  const categoryItems = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon || undefined })),
    [categories],
  );
  const category = categories.find((c) => c.id === values.categoryId) ?? current.category;
  const city = cities.find((c) => c.id === values.cityId) ?? current.city;
  const previewTitle = values.title?.trim() || current.title || "Título de tu aviso";
  const priceType = values.priceType ?? current.price.type;
  // Sin monto válido (vacío, texto o 0) no se inventa un «$0»: la vista previa muestra «Precio por definir».
  const parsedAmount = priceType === "fixed" ? parseClpAmount(values.priceAmount ?? "") : null;
  const previewAmount = parsedAmount !== null && parsedAmount > 0 ? parsedAmount : undefined;

  const badge = (
    <LDCBadge variant={LDC_STATUS_COPY[status].badge}>{STATUS_COPY[status].label}</LDCBadge>
  );
  const statusBadge = reason ? <LDCRejectionReasonDialog title={current.title} reason={reason} /> : badge;

  function onSubmit(v: LDCClassifiedFormValues) {
    if (props.mode === "create") {
      const { action, successHref } = props;
      startSaving(async () => {
        const result = await action(toPayload(v));
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        toast.success("Enviamos tu aviso a revisión", {
          description: "Mientras lo revisamos, lo verás en «Mis avisos» como «En revisión».",
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
      setSaved(result.classified);
      form.reset(toValues(result.classified));
      toast.success("Enviamos tu aviso a revisión", {
        description: "Mientras lo revisamos, no aparece en La Guía.",
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
      <b>Revisamos cada aviso antes de publicarlo.</b> Ya publicado, dura 30 días y lo puedes renovar.
    </>
  ) : (
    <>
      <b>Tu aviso ya está en revisión.</b> Si guardas de nuevo, revisamos la versión más reciente.
    </>
  );

  const previewPanel = (id: string) => (
    <LDCDashboardCard id={id} title="Vista previa" description="Así se ve tu aviso en la lista.">
      <LDCClassifiedCard
        preview
        id={current.id}
        title={previewTitle}
        slug={current.slug}
        type={values.type ?? current.type}
        category={{ name: category.name, slug: category.slug }}
        city={{ name: city.name, slug: city.slug }}
        commune={values.commune?.trim() || undefined}
        image={values.image || current.image}
        price={{ type: priceType, amount: previewAmount }}
        featured={current.featured}
        createdAt={current.createdAt}
      />
    </LDCDashboardCard>
  );

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-4">
            {!isCreate && (
              <LDCStatusNotice status={status} title={STATUS_COPY[status].title} badge={statusBadge}>
                {statusText(status, Boolean(reason))}
              </LDCStatusNotice>
            )}

            <Section id="aviso-datos" title="Tu aviso">
              <LDCClassifiedTypeSelector
                value={values.type ?? current.type}
                onChange={(next) => form.setValue("type", next, { shouldDirty: true })}
                disabled={saving}
              />
              <LDCFormField
                control={control}
                name="title"
                label="Título"
                maxLength={200}
                description="Lo que se lee primero en la lista: qué es y su dato clave."
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField
                  control={control}
                  name="categoryId"
                  label="Categoría"
                  optional
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
              </div>
              <LDCFormField
                control={control}
                name="description"
                label="Descripción"
                type="textarea"
                rows={7}
                description="Solo texto; los saltos de línea separan párrafos."
              />
            </Section>

            <Section id="aviso-precio" title="Precio y ubicación">
              <LDCSegmentedField
                legend="Precio"
                name="ldc-classified-price-type"
                options={PRICE_OPTIONS}
                value={priceType}
                onChange={(next: ClassifiedPriceType) =>
                  form.setValue("priceType", next, { shouldDirty: true, shouldValidate: formState.isSubmitted })
                }
                disabled={saving}
              />
              {priceType === "fixed" && (
                <LDCFormField
                  control={control}
                  name="priceAmount"
                  label="Monto"
                  maxLength={16}
                  icon={<span className="text-sm font-semibold">$</span>}
                  description="En pesos chilenos, sin puntos."
                />
              )}
              <div className="grid gap-6 sm:grid-cols-2">
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
                <LDCFormField control={control} name="commune" label="Comuna" optional maxLength={100} />
              </div>
            </Section>

            <Section id="aviso-imagenes" title="Imágenes">
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
                    hint="JPG, PNG o WebP, hasta 5 MB. Se ve cuadrada en la lista."
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
                    : `Hasta ${GALLERY_MAX} fotos. La primera aparece después de la foto principal.`
                }
                render={({ field, id, describedBy, disabled, setLocalError }) => (
                  <LDCImageGallery
                    id={id}
                    value={field.value}
                    onChange={(urls) => field.onChange(urls)}
                    onError={setLocalError}
                    onBusyChange={setGalleryBusy}
                    max={Math.max(GALLERY_MAX, current.gallery.length)}
                    title={previewTitle}
                    describedBy={describedBy}
                    disabled={disabled || saving}
                  />
                )}
              />
            </Section>

            <Section
              id="aviso-contacto"
              title="Contacto"
              sub="Los tomamos de tu perfil; cámbialos solo para este aviso si quieres."
            >
              <LDCFormField control={control} name="sellerName" label="Nombre" autoComplete="name" maxLength={120} />
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="sellerPhone" label="Teléfono" type="tel" optional autoComplete="tel" icon={<Phone />} />
                <LDCFormField control={control} name="sellerWhatsapp" label="WhatsApp" type="tel" optional icon={<FaWhatsapp />} />
              </div>
              <LDCFormField
                control={control}
                name="sellerEmail"
                label="Email"
                type="email"
                optional
                autoComplete="email"
                icon={<Mail />}
              />
            </Section>

            <div className="lg:hidden">{previewPanel("ldc-aviso-vista-previa-movil")}</div>
          </div>

          <aside className="sticky top-20 hidden flex-col gap-4 lg:flex" aria-label="Enviar y vista previa">
            <LDCDashboardCard id="ldc-aviso-estado" title="Enviar">
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
            {previewPanel("ldc-aviso-vista-previa")}
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
                : "Tu aviso vuelve a como estaba la última vez que lo guardaste. Las fotos que subiste y no guardaste no se usarán."}
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
