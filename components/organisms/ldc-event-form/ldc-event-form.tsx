"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Globe, Info, Mail, MapPin, Phone, Save, Send } from "lucide-react";
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
import { LDCEventCard } from "@/components/molecules/ldc-event-card";
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
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import type { IEventPriceType, IMyEvent, IMyEventInput, IMyEventResult } from "@/interfaces/event";
import type { IListingCategory, IListingCity } from "@/interfaces/listing";
import { descriptionHtmlToText, descriptionTextToHtml } from "@/lib/format/description";
import { santiagoLocalToIso, santiagoParts } from "@/lib/format/events";
import { parseClpAmount } from "@/validations/classified-form-schema";
import { EVENT_GALLERY_MAX, eventFormSchema, type LDCEventFormValues } from "@/validations/event-form-schema";

interface LDCEventFormBaseProps {
  /** Categorías del catálogo (las mismas de comercios y avisos), para el combobox */
  categories: IListingCategory[];
  /** Ciudades para el combobox */
  cities: IListingCity[];
}

/** Editar un evento propio (`/dashboard/eventos/[id]`). */
interface LDCEventFormEditProps extends LDCEventFormBaseProps {
  mode?: "edit";
  /** Evento propio, tal como lo devuelve `GET /me/events/:id` */
  event: IMyEvent;
  /** Server action que guarda (`PATCH /me/events/:id`); deja el evento en `REVIEW` */
  action: (id: string, input: IMyEventInput) => Promise<IMyEventResult>;
}

/** Crear un evento (`/dashboard/eventos/nuevo`): en blanco o a partir de otro («Duplicar»). */
interface LDCEventFormCreateProps extends LDCEventFormBaseProps {
  mode: "create";
  /** Organizador precargado desde el perfil (nombre y correo de la cuenta) */
  defaultOrganizer: { name: string; email: string };
  /** Evento del que se parte al duplicar: se copia todo menos las fechas */
  copyFrom?: IMyEvent;
  /** Server action que crea (`POST /me/events`); el evento nace en `REVIEW` */
  action: (input: IMyEventInput) => Promise<IMyEventResult>;
  /** Adónde ir después de crearlo */
  successHref: string;
}

export type LDCEventFormProps = LDCEventFormEditProps | LDCEventFormCreateProps;

/** Título y etiqueta de cada estado, en masculino (el evento); uno vencido es «Terminado». */
const STATUS_COPY: Record<IDashboardPublicationStatus, { title: string; label: string }> = {
  published: { title: "Tu evento se ve en La Guía", label: "Publicado" },
  review: { title: "Estamos revisando tu evento", label: "En revisión" },
  rejected: { title: "No pudimos aprobar tu evento", label: "Rechazado" },
  expired: { title: "Tu evento ya terminó", label: "Terminado" },
  archived: { title: "Tu evento está archivado", label: "Archivado" },
};

const PRICE_OPTIONS: { value: IEventPriceType; label: string }[] = [
  { value: "FREE", label: "Gratis" },
  { value: "PAID", label: "Con costo" },
];

const orNull = (v: string) => (v.trim() ? v.trim() : null);

function toValues(e: IMyEvent | undefined, organizer: { name: string; email: string }, withDates: boolean): LDCEventFormValues {
  const start = e && withDates ? santiagoParts(e.startsAt) : { date: "", time: "" };
  const end = e?.endsAt && withDates ? santiagoParts(e.endsAt) : { date: "", time: "" };
  return {
    title: e?.title ?? "",
    categoryId: e?.category?.id ?? "",
    description: e ? descriptionHtmlToText(e.description) : "",
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    venueName: e?.venueName ?? "",
    cityId: e?.city.id ?? "",
    commune: e?.commune ?? "",
    address: e?.address ?? "",
    image: e?.image ?? "",
    gallery: e?.gallery ?? [],
    priceType: e?.priceType ?? "FREE",
    priceAmount: e?.priceAmount ? String(e.priceAmount) : "",
    ticketUrl: e?.ticketUrl ?? "",
    organizerName: e?.organizer.name ?? organizer.name,
    organizerPhone: e?.organizer.phone ?? "",
    organizerWhatsapp: e?.organizer.whatsapp ?? "",
    organizerEmail: e ? (e.organizer.email ?? "") : organizer.email,
    organizerWebsite: e?.organizer.website ?? "",
  };
}

function toPayload(v: LDCEventFormValues): IMyEventInput {
  const startsAt = santiagoLocalToIso(v.startDate, v.startTime) ?? "";
  const endsAt = v.endDate && v.endTime ? santiagoLocalToIso(v.endDate, v.endTime) : null;
  return {
    title: v.title.trim(),
    description: descriptionTextToHtml(v.description),
    startsAt,
    endsAt,
    venueName: v.venueName.trim(),
    address: orNull(v.address),
    commune: orNull(v.commune),
    categoryId: v.categoryId || null,
    cityId: v.cityId,
    image: v.image,
    gallery: v.gallery,
    priceType: v.priceType,
    priceAmount: v.priceType === "PAID" ? parseClpAmount(v.priceAmount) : null,
    ticketUrl: orNull(v.ticketUrl),
    organizerName: v.organizerName.trim(),
    organizerPhone: orNull(v.organizerPhone),
    organizerWhatsapp: orNull(v.organizerWhatsapp),
    organizerEmail: orNull(v.organizerEmail),
    organizerWebsite: orNull(v.organizerWebsite),
  };
}

/** Texto bajo el estado: qué significa y qué pasa si guardas. */
function statusText(status: IDashboardPublicationStatus, hasReason: boolean): ReactNode {
  switch (status) {
    case "published":
      return "Si cambias algo, lo revisamos antes de volver a publicarlo.";
    case "review":
      return "Mientras lo revisamos, tu evento no aparece en La Guía. Puedes seguir editándolo.";
    case "rejected":
      return (
        <>
          {hasReason ? "Presiona «Rechazado» para ver el motivo. " : ""}Corrige lo que te indicamos y vuelve a
          enviarlo. Si tienes dudas,{" "}
          <Link href="/contacto" className="font-semibold text-pink underline-offset-2 hover:underline dark:text-yellow">
            escríbenos
          </Link>
          .
        </>
      );
    case "expired":
      return "Ya no aparece en el listado de eventos. Para repetirlo, usa «Duplicar» en «Mis eventos».";
    case "archived":
      return "Lo archivaste y no aparece en La Guía. Si guardas un cambio, sale del archivo y pasa a revisión.";
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

/** Fecha y hora de un extremo del evento, en una fila (`1.4fr / 1fr`, cabe a 320 px). */
function DateTimeRow({ legend, optional, children }: { legend: string; optional?: boolean; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-sm font-semibold">
        {legend}
        {optional && <span className="font-normal text-muted-foreground"> (opcional)</span>}
      </legend>
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">{children}</div>
    </fieldset>
  );
}

/**
 * LDCEventForm - Evento: formulario + vista previa (alternativa B de CLGDC-137)
 *
 * Mismo formato que `LDCClassifiedForm` y `LDCListingForm`: tarjetas «Qué es», «Cuándo», «Dónde»,
 * «Imagen», «Entrada» y «Organizador» a la izquierda; desde `lg`, a la derecha y fija, la columna
 * «Enviar» y la vista previa en `LDCEventCard` (muestra la fecha en hora de Chile mientras se
 * escribe). En móvil, la vista previa va al final y el guardado en `LDCFormSaveBar`.
 *
 * Fechas con `<input type="date">` + `type="time"` nativos; el ISO se arma en `America/Santiago`.
 * La descripción se escribe en texto plano y se guarda como `<p>`/`<br>`. Al crear (o duplicar con
 * `copyFrom`, que copia todo menos las fechas) avisa con un toast y navega a `successHref`; al
 * editar, el estado va arriba en `LDCStatusNotice`. Guardar siempre deja el evento en revisión.
 */
export function LDCEventForm(props: LDCEventFormProps) {
  const { categories, cities } = props;
  const isCreate = props.mode === "create";
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [saved, setSaved] = useState(props.mode === "create" ? undefined : props.event);
  const [imageBusy, setImageBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const organizer = props.mode === "create" ? props.defaultOrganizer : { name: "", email: "" };
  const copyFrom = props.mode === "create" ? props.copyFrom : undefined;
  const defaults = useMemo(
    () => (saved ? toValues(saved, organizer, true) : toValues(copyFrom, organizer, false)),
    // `organizer` sale de props que no cambian en la vida del formulario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saved, copyFrom],
  );
  const schema = useMemo(() => eventFormSchema({ requireFuture: isCreate }), [isCreate]);
  const form = useForm<LDCEventFormValues>({
    resolver: zodResolver(schema) as Resolver<LDCEventFormValues>,
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { control, formState } = form;
  const values = useWatch({ control }) as LDCEventFormValues;

  const status = saved?.status;
  const reason = status === "rejected" ? saved?.rejectionReason : undefined;
  const busy = imageBusy || galleryBusy;
  const dirty = formState.isDirty;
  const canSubmit = !busy && !saving && (isCreate || dirty || status === "rejected");

  const categoryItems = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon || undefined })),
    [categories],
  );
  const category = categories.find((c) => c.id === values.categoryId);
  const city = cities.find((c) => c.id === values.cityId);
  const previewTitle = values.title?.trim() || "Nombre de tu evento";
  const priceType = values.priceType ?? "FREE";
  const previewAmount = priceType === "PAID" ? (parseClpAmount(values.priceAmount ?? "") ?? undefined) : undefined;
  const previewStart = santiagoLocalToIso(values.startDate ?? "", values.startTime || "00:00") ?? undefined;
  const previewEnd =
    values.endDate && previewStart
      ? (santiagoLocalToIso(values.endDate, values.endTime || "23:59") ?? undefined)
      : undefined;

  function onSubmit(v: LDCEventFormValues) {
    if (props.mode === "create") {
      const { action, successHref } = props;
      startSaving(async () => {
        const result = await action(toPayload(v));
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        toast.success("Enviamos tu evento a revisión", {
          description: "Mientras lo revisamos, lo verás en «Mis eventos» como «En revisión».",
        });
        router.push(successHref);
      });
      return;
    }
    const { action } = props;
    startSaving(async () => {
      const result = await action(props.event.id, toPayload(v));
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setSaved(result.event);
      form.reset(toValues(result.event, organizer, true));
      toast.success("Enviamos tu evento a revisión", {
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
  ) : isCreate ? (
    <>
      <b>Revisamos cada evento antes de publicarlo.</b> Mientras tanto, no aparece en La Guía.
    </>
  ) : status === "review" ? (
    <>
      <b>Tu evento ya está en revisión.</b> Si guardas de nuevo, revisamos la versión más reciente.
    </>
  ) : status === "archived" ? (
    <b>Al guardar, sale del archivo y pasa a revisión.</b>
  ) : (
    <>
      <b>Al guardar, tu evento vuelve a revisión.</b> Mientras lo revisamos, no aparece en La Guía.
    </>
  );

  const previewPanel = (id: string) => (
    <LDCDashboardCard id={id} title="Vista previa" description="Así se ve tu evento en La Guía.">
      <LDCEventCard
        preview
        id=""
        title={previewTitle}
        slug=""
        startsAt={previewStart}
        endsAt={previewEnd}
        venueName={values.venueName?.trim() ?? ""}
        city={{ name: city?.name ?? "", slug: city?.slug ?? "" }}
        category={category ? { name: category.name } : undefined}
        image={values.image ?? ""}
        priceType={priceType}
        priceAmount={previewAmount}
      />
    </LDCDashboardCard>
  );

  const statusBadge =
    status && reason ? (
      <LDCRejectionReasonDialog title={saved?.title ?? ""} reason={reason} />
    ) : status ? (
      <LDCBadge variant={LDC_STATUS_COPY[status].badge}>{STATUS_COPY[status].label}</LDCBadge>
    ) : null;

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-4">
            {status && (
              <LDCStatusNotice status={status} title={STATUS_COPY[status].title} badge={statusBadge}>
                {statusText(status, Boolean(reason))}
              </LDCStatusNotice>
            )}

            <Section id="evento-que" title="Qué es">
              <LDCFormField
                control={control}
                name="title"
                label="Nombre del evento"
                required
                maxLength={200}
                description="Hasta 200 caracteres. Ej.: «Feria costumbrista de primavera»."
              />
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
              <LDCFormField
                control={control}
                name="description"
                label="Descripción"
                type="textarea"
                required
                rows={7}
                description="Qué va a pasar, para quién es y qué llevar. Separa los párrafos con una línea en blanco."
              />
            </Section>

            <Section id="evento-cuando" title="Cuándo">
              <DateTimeRow legend="Empieza">
                <LDCFormField control={control} name="startDate" label="Fecha" type="date" required />
                <LDCFormField control={control} name="startTime" label="Hora" type="time" required />
              </DateTimeRow>
              <DateTimeRow legend="Termina" optional>
                <LDCFormField control={control} name="endDate" label="Fecha" type="date" />
                <LDCFormField control={control} name="endTime" label="Hora" type="time" />
              </DateTimeRow>
              <p className="-mt-2 flex gap-2 font-open-sans text-[13px] text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  Hora de Chile continental. Si no pones cuándo termina, el evento deja de mostrarse a la hora de
                  inicio.
                </span>
              </p>
            </Section>

            <Section id="evento-donde" title="Dónde">
              <LDCFormField
                control={control}
                name="venueName"
                label="Lugar"
                required
                maxLength={200}
                icon={<MapPin />}
                description="El nombre del recinto o del espacio: «Teatro Municipal», «Plaza de Armas»."
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField
                  control={control}
                  name="cityId"
                  label="Ciudad"
                  required
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
              <LDCFormField
                control={control}
                name="address"
                label="Dirección"
                optional
                maxLength={300}
                autoComplete="street-address"
              />
            </Section>

            <Section id="evento-imagen" title="Imagen">
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
                    alt={`Imagen principal de ${previewTitle}`}
                    hint="Se ve en la tarjeta del evento. JPG, PNG o WebP, hasta 5 MB. Mejor en horizontal y sin texto encima."
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
                description={`Hasta ${EVENT_GALLERY_MAX} fotos del lugar o de ediciones anteriores.`}
                render={({ field, id, describedBy, disabled, setLocalError }) => (
                  <LDCImageGallery
                    id={id}
                    value={field.value}
                    onChange={(urls) => field.onChange(urls)}
                    onError={setLocalError}
                    onBusyChange={setGalleryBusy}
                    max={Math.max(EVENT_GALLERY_MAX, saved?.gallery.length ?? 0)}
                    title={previewTitle}
                    describedBy={describedBy}
                    disabled={disabled || saving}
                  />
                )}
              />
            </Section>

            <Section id="evento-entrada" title="Entrada">
              <LDCSegmentedField
                legend="¿Cuánto cuesta entrar?"
                name="ldc-event-price-type"
                options={PRICE_OPTIONS}
                value={priceType}
                onChange={(next: IEventPriceType) =>
                  form.setValue("priceType", next, { shouldDirty: true, shouldValidate: formState.isSubmitted })
                }
                disabled={saving}
              />
              {priceType === "PAID" && (
                <LDCFormField
                  control={control}
                  name="priceAmount"
                  label="Valor de la entrada"
                  required
                  inputMode="numeric"
                  maxLength={16}
                  icon={<span className="text-sm font-semibold">$</span>}
                  description="En pesos, sin puntos. Si hay varios valores, pon el más bajo."
                />
              )}
              <LDCFormField
                control={control}
                name="ticketUrl"
                label={priceType === "PAID" ? "Enlace para comprar" : "Enlace para inscribirse"}
                type="url"
                optional
                placeholder="https://"
                autoComplete="url"
              />
            </Section>

            <Section
              id="evento-organizador"
              title="Organizador"
              sub={
                isCreate
                  ? "Se muestra en el evento para que te contacten. Lo traemos de tu perfil."
                  : "Se muestra en el evento para que te contacten."
              }
            >
              <LDCFormField
                control={control}
                name="organizerName"
                label="Quién organiza"
                required
                maxLength={120}
                autoComplete="organization"
                description="Tu nombre, el de tu agrupación o el de la institución."
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="organizerPhone" label="Teléfono" type="tel" optional autoComplete="tel" icon={<Phone />} />
                <LDCFormField control={control} name="organizerWhatsapp" label="WhatsApp" type="tel" optional icon={<FaWhatsapp />} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <LDCFormField control={control} name="organizerEmail" label="Email" type="email" optional autoComplete="email" icon={<Mail />} />
                <LDCFormField
                  control={control}
                  name="organizerWebsite"
                  label="Sitio web"
                  type="url"
                  optional
                  placeholder="https://"
                  autoComplete="url"
                  icon={<Globe />}
                />
              </div>
            </Section>

            <div className="lg:hidden">{previewPanel("ldc-evento-vista-previa-movil")}</div>
          </div>

          <aside className="sticky top-20 hidden flex-col gap-4 lg:flex" aria-label="Enviar y vista previa">
            <LDCDashboardCard id="ldc-evento-estado" title={isCreate ? "Tu evento nuevo" : "Enviar"}>
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
            {previewPanel("ldc-evento-vista-previa")}
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
                : "Tu evento vuelve a como estaba la última vez que lo guardaste. Las fotos que subiste y no guardaste no se usarán."}
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
