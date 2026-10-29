import { Store } from "lucide-react";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { cn } from "@/lib/utils";

export interface LDCPublishBannerProps {
  /** Destino del CTA (la página de alta de la ficha) */
  href: string;
  /** Título */
  title?: string;
  /** Línea bajo el título */
  description?: string;
  /** Texto del CTA */
  ctaText?: string;
  className?: string;
}

/**
 * LDCPublishBanner - Invitación a publicar un comercio o servicio
 *
 * `LDCPanel` con borde de marca, ícono, título, una línea y `LDCCTAButton` a la página de alta. En
 * móvil el CTA baja y ocupa el ancho; desde `sm`, va a la derecha. Lo muestra el inicio del panel
 * del usuario.
 *
 * @example
 * <LDCPublishBanner href="/dashboard/publicar" />
 */
export function LDCPublishBanner({
  href,
  title = "Publica tu comercio o servicio",
  description = "Crea tu ficha con fotos, contacto y horario. La revisamos antes de publicarla y tu cuenta pasa a ser de comercio.",
  ctaText = "Publicar mi ficha",
  className,
}: LDCPublishBannerProps) {
  return (
    <LDCPanel
      as="section"
      aria-labelledby="ldc-publish-banner-title"
      className={cn(
        "flex flex-col gap-4 border-pink/40 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-yellow/40",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full bg-orange text-black"
        >
          <Store className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 id="ldc-publish-banner-title" className="text-base font-extrabold">
            {title}
          </h2>
          <p className="mt-0.5 font-open-sans text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <LDCCTAButton href={href} text={ctaText} className="w-full shrink-0 justify-center sm:w-auto" />
    </LDCPanel>
  );
}
