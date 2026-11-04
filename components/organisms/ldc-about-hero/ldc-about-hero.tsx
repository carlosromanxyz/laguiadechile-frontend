import {
  LDCAccentBars,
  LDCDecorativeLayer,
  LDCDecorativeShape,
} from "@/components/atoms/ldc-decorative-shapes";
import { LDCMotionPauseButton } from "@/components/atoms/ldc-motion-pause-button";
import { LDCMotionPauseProvider } from "@/components/shared/ldc-motion-pause-provider";
import { LDCAboutHeroIllustration } from "@/components/molecules/ldc-about-hero-illustration";
import {
  LDC_CHILE_SKYLINE_RESERVE,
  LDCChileSkyline,
} from "@/components/organisms/ldc-chile-skyline";
import { cn } from "@/lib/utils";

/**
 * LDCAboutHero - About Page Hero Section
 *
 * Enhanced hero section with flowing narrative design featuring
 * the brand stripes background, decorative blur shapes, and asymmetric layout.
 *
 * Design elements:
 * - Background with the isotype bands (`brand-stripes`): solid pink, orange,
 *   yellow and purple sliding in 10 s. `animate-color-slide-ink` runs that slide
 *   and, in sync, the `--ldc-hero-ink` color (black on pink, orange and yellow, white
 *   on purple: AA on every band) that the text, chip, accent bars and pause button
 *   use. Still (pink band, black ink) with prefers-reduced-motion and paused with the
 *   pause button. Both overrides carry `!`: the animation class lives outside the
 *   Tailwind layers in globals.css, so a layered utility alone would not beat it
 * - Decorative blur shapes for depth
 * - Asymmetric 7/5 grid layout
 * - Enhanced typography with badge and improved messaging
 * - Animated city illustration (LDCAboutHeroIllustration) with glow effects and accent elements
 * - Pause button (WCAG 2.2.2) that freezes the illustration and the decorative
 *   shapes and background of the hero through LDCMotionPauseProvider; hidden with prefers-reduced-motion
 * - Skyline of Chilean monuments biting the bottom edge (LDCChileSkyline)
 *
 * El padding inferior reserva el alto de la silueta, que escala con el ancho
 * (LDC_CHILE_SKYLINE_RESERVE).
 *
 * @example
 * ```tsx
 * <LDCAboutHero />
 * ```
 */
export function LDCAboutHero() {
  return (
    <LDCMotionPauseProvider>
      <section
        className={cn(
          "relative w-full overflow-hidden brand-stripes animate-color-slide-ink motion-reduce:animate-none! in-data-[ldc-motion-paused=true]:[animation-play-state:paused]! pt-24 md:pt-32 lg:pt-40",
          LDC_CHILE_SKYLINE_RESERVE,
        )}
      >
        {/* Decorative background layer */}
        <LDCDecorativeLayer>
          {/* Large blur shape - top left */}
          <LDCDecorativeShape
            variant="blob"
            delay={0}
            ariaHidden={false}
            layout="-left-40 -top-40 h-[600px] w-[600px]"
            fill="bg-purple/30"
          />

          {/* Medium blur shape - bottom right */}
          <LDCDecorativeShape
            variant="blob"
            delay={4}
            ariaHidden={false}
            layout="-bottom-20 -right-20 h-96 w-96"
            fill="bg-orange/20"
          />

          {/* Small accent shape - floating */}
          <LDCDecorativeShape
            variant="spot"
            delay={2}
            ariaHidden={false}
            layout="right-1/4 top-1/3 h-32 w-32 rotate-45 rounded-2xl"
            fill="bg-yellow/20"
          />
        </LDCDecorativeLayer>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Content Column - 7 columns */}
            <div className="space-y-8 text-(--ldc-hero-ink) lg:col-span-7">
              <div className="space-y-6">
                {/* Contextual Badge */}
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-(--ldc-hero-ink)/30">
                  <span className="flex h-2 w-2 rounded-full bg-(--ldc-hero-ink) animate-pulse in-data-[ldc-motion-paused=true]:[animation-play-state:paused]" />
                  Quiénes somos
                </div>

                {/* Primary Heading */}
                <h1 className="text-4xl font-bold font-mulish sm:text-5xl lg:text-6xl">
                  Negocios y servicios de{" "}
                  <span className="relative isolate inline-block">
                    <span className="relative z-10">tu ciudad</span>
                    <span className="absolute bottom-2 left-0 -z-10 h-3 w-full bg-yellow/50 blur-sm" />
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-xl lg:text-2xl">
                  Busca por ciudad o región y contacta al negocio directamente.
                </p>
              </div>

              {/* Body Paragraph */}
              <p className="text-lg leading-relaxed">
                Cada ficha muestra dónde está el negocio, a qué hora atiende y cómo contactarlo
                por teléfono o WhatsApp. Si tienes un comercio o das un servicio, también puedes
                publicarlo.
              </p>

              {/* Decorative accents */}
              <LDCAccentBars
                bars={[
                  { width: "w-16", fill: "bg-(--ldc-hero-ink)/60" },
                  { width: "w-12", fill: "bg-(--ldc-hero-ink)/40" },
                  { width: "w-8", fill: "bg-(--ldc-hero-ink)/20" },
                ]}
              />
            </div>

            {/* Image Column - 5 columns */}
            <div className="relative lg:col-span-5">
              {/* Vertical accent bar */}
              <LDCDecorativeShape
                variant="bar"
                delay={1}
                layout="-right-4 top-12 h-40"
                fill="bg-yellow"
              />

              <div className="relative">
                <LDCAboutHeroIllustration className="relative w-full h-auto drop-shadow-2xl" />

                {/* Colored glow */}
                <LDCDecorativeShape
                  variant="glow"
                  delay={3}
                  fill="bg-yellow/30"
                />
              </div>

              {/* Corner accent shape */}
              <LDCDecorativeShape
                variant="corner"
                delay={1.5}
                layout="-bottom-6 -left-6 h-24 w-24 -rotate-12"
                fill="bg-pink"
              />

              {/* Pausa de la ilustración y de las formas del hero (WCAG 2.2.2) */}
              <LDCMotionPauseButton tone="ink" className="relative mt-4 ml-auto flex" />
            </div>
          </div>
        </div>

        {/* Monumentos de Chile en el borde inferior: «muerden» el paso a LDCAboutWhat */}
        <LDCChileSkyline variant="bite" />
      </section>
    </LDCMotionPauseProvider>
  );
}
