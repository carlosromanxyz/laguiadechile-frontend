"use client";

import { FileText, X } from "lucide-react";
import type { MouseEvent } from "react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCListingGallery } from "@/components/molecules/ldc-listing-gallery";
import { LDCListingMap } from "@/components/molecules/ldc-listing-map";
import { LDCListingSocialMedia } from "@/components/molecules/ldc-listing-social-media";
import { LDCListingDetailHero } from "@/components/organisms/ldc-listing-detail-hero";
import { LDCListingInfo } from "@/components/organisms/ldc-listing-info";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";
import type { IListingDetail } from "@/interfaces/listing";
import { descriptionParagraphs } from "@/lib/format/description";

export interface LDCListingPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ficha armada con los valores actuales del formulario (sin guardar) */
  listing: IListingDetail;
  /** Descripción tal como se escribe en el formulario (texto, no HTML) */
  descriptionText: string;
}

const SECTION = {
  comercio: { label: "Comercios", href: "/comercios" },
  servicio: { label: "Servicios", href: "/servicios" },
} as const;

/** En la vista previa, los enlaces internos no navegan: saldrías del formulario sin guardar. */
function keepInPreview(e: MouseEvent<HTMLDivElement>) {
  const anchor = (e.target as HTMLElement).closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href") ?? "";
  if (href.startsWith("/") || href.startsWith("#") || anchor.origin === window.location.origin) {
    e.preventDefault();
  }
}

/**
 * LDCListingPreviewDialog - Vista de detalle de la ficha, en un modal, con lo que aún no se guarda
 *
 * Reutiliza las piezas del detalle público (hero, descripción, ubicación, galería, contacto,
 * horario y redes) sin pedir datos. La descripción sale del texto del formulario, en párrafos de
 * React: nunca se inyecta HTML. Los enlaces internos no navegan (se perderían los cambios).
 */
export function LDCListingPreviewDialog({
  open,
  onOpenChange,
  listing,
  descriptionText,
}: LDCListingPreviewDialogProps) {
  const section = SECTION[listing.type];
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: section.label, href: section.href },
    { label: listing.category.name, href: `${section.href}?categoria=${listing.category.slug}` },
    { label: listing.title, href: "" },
  ];
  const paragraphs = descriptionParagraphs(descriptionText);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-2rem)] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
      >
        <DialogHeader className="flex-row items-center justify-between gap-3 border-b px-4 py-3 text-left md:px-6">
          <div className="min-w-0">
            <DialogTitle className="font-extrabold">Vista previa de tu ficha</DialogTitle>
            <DialogDescription className="font-open-sans">
              Así se verá con los cambios que aún no guardas.
            </DialogDescription>
          </div>
          <DialogClose className="grid size-10 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
            <X className="size-5" aria-hidden />
            <span className="sr-only">Cerrar vista previa</span>
          </DialogClose>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto" onClickCapture={keepInPreview}>
          <LDCListingDetailHero listing={listing} breadcrumbs={breadcrumbs} className="pt-6 pb-6 md:pt-8 md:pb-8" />

          <div className="grid grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-3">
            <div className="min-w-0 space-y-6 lg:col-span-2">
              <LDCPanel padding="lg">
                <h2 className="mb-4 flex items-center gap-2 font-mulish text-xl font-bold text-foreground">
                  <FileText className="h-5 w-5 text-pink" aria-hidden />
                  Descripción
                </h2>
                <div className="prose prose-sm max-w-none text-justify text-muted-foreground dark:prose-invert prose-p:mb-4 prose-p:last:mb-0">
                  {paragraphs.length ? (
                    paragraphs.map((lines, i) => (
                      <p key={i}>
                        {lines.map((line, j) => (
                          <span key={j}>
                            {j > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </p>
                    ))
                  ) : (
                    <p className="italic">Aún no escribes una descripción.</p>
                  )}
                </div>
              </LDCPanel>

              {listing.address && <LDCListingMap address={listing.address} city={listing.city.name} />}

              {listing.gallery.length > 0 && <LDCListingGallery images={listing.gallery} title={listing.title} />}
            </div>

            <div className="min-w-0 space-y-6">
              <LDCListingInfo listingTitle={listing.title} contact={listing.contact} schedule={listing.schedule} />
              <LDCListingSocialMedia socialMedia={listing.socialMedia} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
