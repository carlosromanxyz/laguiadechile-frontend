import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCTimeSwitch } from "@/components/atoms/ldc-time-switch";
import { LDCFavoriteButton } from "@/components/molecules/ldc-favorite-button";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { LDCPageHero } from "@/components/organisms/ldc-page-hero";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";
import type { IEvent } from "@/interfaces/event";
import { formatEventWhen } from "@/lib/format/events";
import { getIcon } from "@/lib/get-icon";

interface LDCEventDetailHeroProps {
  event: IEvent;
  breadcrumbs: IBreadcrumbItem[];
  /** Ya terminó al renderizar en el servidor; en el navegador «Terminado» lo decide `LDCTimeSwitch` */
  past?: boolean;
  className?: string;
}

/**
 * LDCEventDetailHero - Hero del detalle de un evento (CLGDC-139)
 *
 * Como `LDCClassifiedDetailHero`: badges (categoría `kind-event`, destacado y «Terminado» si ya
 * pasó), título, cuándo (hora de Chile) y lugar con enlace a la ciudad, y a la derecha compartir y
 * guardar en favoritos (`kind="EVENT"`). Las fechas llevan `timeZone`, así que es seguro en server.
 */
export function LDCEventDetailHero({ event, breadcrumbs, past, className }: LDCEventDetailHeroProps) {
  return (
    <LDCPageHero breadcrumbs={breadcrumbs} className={className}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {event.category && (
          <LDCBadge variant="kind-event">
            {renderCategoryIcon(event.category.icon)}
            {event.category.name}
          </LDCBadge>
        )}
        {event.featured && (
          <LDCBadge variant="featured">
            <Star className="mr-1 size-3 fill-current" aria-hidden />
            Destacado
          </LDCBadge>
        )}
        <LDCTimeSwitch
          at={event.endsAt ?? event.startsAt}
          serverPassed={Boolean(past)}
          after={<LDCBadge variant="status-expired">Terminado</LDCBadge>}
        />
      </div>

      <h1 className="mb-4 font-mulish text-3xl font-bold text-foreground [overflow-wrap:anywhere] md:text-4xl lg:text-5xl">
        {event.title}
      </h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 text-muted-foreground">
          <p className="flex items-center gap-2 text-lg">
            <CalendarDays className="size-5 shrink-0 text-pink dark:text-yellow" aria-hidden />
            <time dateTime={event.startsAt}>{formatEventWhen(event.startsAt, event.endsAt)}</time>
          </p>
          <Link
            href={`/ciudad/${event.city.slug}`}
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <MapPin className="size-5 shrink-0 text-pink dark:text-yellow" aria-hidden />
            <span className="text-lg">
              {event.venueName} ·{" "}
              {event.commune && event.commune !== event.city.name ? `${event.commune}, ` : ""}
              {event.city.name}
            </span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LDCSocialShareButtons title={event.title} variant="dark" />
          <LDCFavoriteButton kind="EVENT" targetId={event.id} title={event.title} variant="pill" />
        </div>
      </div>
    </LDCPageHero>
  );
}

// Fuera del render: el ícono de la categoría, por nombre (`lib/get-icon`).
function renderCategoryIcon(iconName?: string): React.ReactNode {
  const Icon = iconName ? getIcon(iconName) : null;
  return Icon ? <Icon className="mr-1 size-3" aria-hidden /> : null;
}
