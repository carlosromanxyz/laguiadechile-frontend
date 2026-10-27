import Image from "next/image";
import {
  LDCAccentBars,
  LDCDecorativeLayer,
  LDCDecorativeShape,
} from "@/components/atoms/ldc-decorative-shapes";
import { LDCChileSkyline } from "@/components/organisms/ldc-chile-skyline";

/**
 * LDCAboutHero - About Page Hero Section
 *
 * Enhanced hero section with flowing narrative design featuring
 * multi-layered gradients, decorative blur shapes, and asymmetric layout.
 *
 * Design elements:
 * - Three-color gradient background (purple → pink → orange-red)
 * - Decorative blur shapes for depth
 * - Asymmetric 7/5 grid layout
 * - Enhanced typography with badge and improved messaging
 * - Image with glow effects and accent elements
 * - Skyline of Chilean monuments biting the bottom edge (LDCChileSkyline)
 *
 * @example
 * ```tsx
 * <LDCAboutHero />
 * ```
 */
export function LDCAboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-purple via-pink/90 to-orange-red py-24 md:py-32 lg:py-40">
      {/* Decorative background layer */}
      <LDCDecorativeLayer>
        {/* Large blur shape - top left */}
        <LDCDecorativeShape
          variant="blob"
          delay={0}
          ariaHidden={false}
          layout="-left-40 -top-40 h-[600px] w-[600px]"
          fill="bg-gradient-to-br from-purple/30 via-pink/20 to-transparent"
        />

        {/* Medium blur shape - bottom right */}
        <LDCDecorativeShape
          variant="blob"
          delay={4}
          ariaHidden={false}
          layout="-bottom-20 -right-20 h-96 w-96"
          fill="bg-gradient-to-tl from-orange/20 via-yellow/10 to-transparent"
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
          <div className="space-y-8 text-white lg:col-span-7">
            <div className="space-y-6">
              {/* Contextual Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/30">
                <span className="flex h-2 w-2 rounded-full bg-yellow animate-pulse" />
                Conoce nuestra historia
              </div>

              {/* Primary Heading */}
              <h1 className="text-4xl font-bold font-mulish sm:text-5xl lg:text-6xl">
                Tu puerta de entrada a{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Chile completo</span>
                  <span className="absolute bottom-2 left-0 -z-10 h-3 w-full bg-yellow/50 blur-sm" />
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-white/90 lg:text-2xl">
                Para negocios que quieren crecer. Para personas que buscan descubrir.
              </p>
            </div>

            {/* Body Paragraph */}
            <p className="text-lg text-white/80 leading-relaxed">
              La Guía de Chile conecta emprendedores y comercios con clientes que necesitan
              sus servicios. Una plataforma donde promocionar tu negocio es simple, y encontrar
              lo que buscas es aún más fácil.
            </p>

            {/* Decorative accents */}
            <LDCAccentBars
              bars={[
                { width: "w-16", fill: "bg-white/60" },
                { width: "w-12", fill: "bg-white/40" },
                { width: "w-8", fill: "bg-white/20" },
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
              fill="from-yellow to-orange"
            />

            <div className="relative">
              <Image
                src="/images/about-hero-illustration.svg"
                alt="La Guía de Chile - Descubre negocios en tu ciudad"
                width={600}
                height={530}
                className="relative w-full h-auto drop-shadow-2xl"
                priority
              />

              {/* Colored glow */}
              <LDCDecorativeShape
                variant="glow"
                delay={3}
                fill="bg-gradient-to-tr from-yellow/30 via-orange/20 to-pink/20"
              />
            </div>

            {/* Corner accent shape */}
            <LDCDecorativeShape
              variant="corner"
              delay={1.5}
              layout="-bottom-6 -left-6 h-24 w-24 -rotate-12"
              fill="from-pink to-purple"
            />
          </div>
        </div>
      </div>

      {/* Monumentos de Chile en el borde inferior: «muerden» el paso a LDCAboutWhat */}
      <LDCChileSkyline variant="bite" />
    </section>
  );
}
