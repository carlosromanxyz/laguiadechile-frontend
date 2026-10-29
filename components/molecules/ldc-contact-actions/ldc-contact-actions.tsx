import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, ExternalLink } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { trackMetric } from "@/lib/metrics/track-metric";
import type { IMetricKind } from "@/interfaces/metric";

interface LDCContactActionsBaseProps {
  /** Phone number; spaces are removed for the `tel:` link */
  phone?: string;
  /** WhatsApp number; non-digits are removed for the `wa.me` link */
  whatsapp?: string;
  /** Prefilled WhatsApp message, plain text (it is URL-encoded here) */
  whatsappMessage?: string;
  /** WhatsApp button label. Defaults to "Escribir por WhatsApp" (stack) or "Escribir" (row). */
  whatsappLabel?: string;
  /** Classes for the buttons container only */
  className?: string;
  /**
   * Listing (comercio/servicio) id. If given, each click on WhatsApp, call or
   * website sends its metrics event without blocking the navigation. Only
   * pass it from a client tree (it adds `onClick` handlers); classifieds and
   * properties leave it out and send nothing.
   */
  listingId?: string;
}

interface LDCContactActionsStackProps extends LDCContactActionsBaseProps {
  /** Seller/agent boxes (default) */
  layout?: "stack";
  /** Email address (stack only) */
  email?: string;
  /** Email subject, plain text (it is URL-encoded here) */
  emailSubject?: string;
  website?: never;
}

interface LDCContactActionsRowProps extends LDCContactActionsBaseProps {
  /** Listing contact box */
  layout: "row";
  /** Website URL (row only), rendered as a text link below the buttons */
  website?: string;
  email?: never;
  emailSubject?: never;
}

type LDCContactActionsProps =
  | LDCContactActionsStackProps
  | LDCContactActionsRowProps;

/**
 * LDCContactActions - Direct Contact Buttons
 *
 * Renders the direct contact actions that have data. Two layouts, matching
 * the boxes that use them today:
 *
 * - `stack` (default; seller and agent boxes): `space-y-3` container with
 *   full-width `lg` buttons in this order: WhatsApp (green, default label
 *   "Escribir por WhatsApp"), "Llamar" (outline) and "Enviar email" (outline,
 *   optional `emailSubject`). No website link.
 * - `row` (listing info box): `flex gap-3` container with `flex-1` `lg`
 *   buttons in this order: "Llamar" (pink, default variant) and WhatsApp
 *   (green, default label "Escribir"). No email button (the listing uses a
 *   form). If `website` is given, a "Visitar sitio web" link is rendered as a
 *   sibling after the container, so `className` does not reach it.
 *
 * @example
 * ```tsx
 * <LDCContactActions
 *   whatsapp={seller.whatsapp}
 *   whatsappMessage={`Hola ${seller.name}, vi tu aviso "${title}" en La Guía de Chile y me interesa.`}
 *   phone={seller.phone}
 *   email={seller.email}
 *   emailSubject={`Consulta por: ${title}`}
 * />
 *
 * <LDCContactActions
 *   layout="row"
 *   phone={contact.phone}
 *   whatsapp={contact.whatsapp}
 *   whatsappMessage={`Hola, me contacto desde La Guía de Chile por ${title}`}
 *   website={contact.website}
 * />
 * ```
 */
export function LDCContactActions(props: LDCContactActionsProps) {
  const { phone, whatsapp, whatsappMessage, whatsappLabel, className, listingId } =
    props;

  const track = (kind: IMetricKind) =>
    listingId ? () => trackMetric(listingId, kind) : undefined;

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}${
        whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""
      }`
    : undefined;

  if (props.layout === "row") {
    const { website } = props;

    return (
      <>
        <div className={cn("flex gap-3", className)}>
          {phone && (
            <Button
              asChild
              size="lg"
              className="flex-1 bg-pink hover:bg-pink/90 text-white"
            >
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                onClick={track("call")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Llamar
              </a>
            </Button>
          )}
          {whatsappHref && (
            <Button
              asChild
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={track("whatsapp")}
              >
                <FaWhatsapp className="w-5 h-5 mr-2" />
                {whatsappLabel ?? "Escribir"}
              </a>
            </Button>
          )}
        </div>

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={track("web")}
            className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hover:text-pink transition-colors"
          >
            <Globe className="w-4 h-4" />
            Visitar sitio web
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </>
    );
  }

  const { email, emailSubject } = props;

  return (
    <div className={cn("space-y-3", className)}>
      {whatsappHref && (
        <Button
          asChild
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={track("whatsapp")}
          >
            <FaWhatsapp className="w-5 h-5 mr-2" />
            {whatsappLabel ?? "Escribir por WhatsApp"}
          </a>
        </Button>
      )}

      {phone && (
        <Button asChild size="lg" variant="outline" className="w-full">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            onClick={track("call")}
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamar
          </a>
        </Button>
      )}

      {email && (
        <Button asChild size="lg" variant="outline" className="w-full">
          <a
            href={`mailto:${email}${
              emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ""
            }`}
          >
            <Mail className="w-5 h-5 mr-2" />
            Enviar email
          </a>
        </Button>
      )}
    </div>
  );
}
