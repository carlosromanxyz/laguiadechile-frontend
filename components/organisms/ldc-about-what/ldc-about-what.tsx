import { LDCDecorativeShape } from "@/components/atoms/ldc-decorative-shapes";
import { LDCMotionPauseButton } from "@/components/atoms/ldc-motion-pause-button";
import { LDCMotionPauseProvider } from "@/components/shared/ldc-motion-pause-provider";
import { LDCAboutWhatIllustration } from "@/components/molecules/ldc-about-what-illustration";

/**
 * LDCAboutWhat - "What is La Guía de Chile" Section
 *
 * Section explaining what La Guía de Chile is.
 * Features flowing narrative design with gradient backgrounds and decorative elements,
 * and an animated illustration (LDCAboutWhatIllustration) with a pause button
 * (WCAG 2.2.2) that freezes it and the decorative shapes of the section through
 * LDCMotionPauseProvider; hidden with prefers-reduced-motion. The button is
 * absolutely positioned under the illustration, so it does not change the layout.
 *
 * @example
 * ```tsx
 * <LDCAboutWhat />
 * ```
 */
export function LDCAboutWhat() {
  return (
    <LDCMotionPauseProvider>
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-pink/5 via-background to-background py-24 md:py-32">
        {/* Decorative shape - top right (top-24: no tiñe el borde que muerde LDCChileSkyline) */}
        <LDCDecorativeShape
          variant="blob"
          delay={0}
          layout="right-0 top-24 h-96 w-96 translate-x-1/2"
          fill="bg-gradient-to-br from-yellow/20 to-orange/10"
        />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Image Column - 5 columns */}
            <div className="relative lg:col-span-5">
              {/* Colored accent bar */}
              <LDCDecorativeShape
                variant="bar"
                delay={1.5}
                layout="-left-4 top-8 h-32"
                fill="from-purple to-pink"
              />

              {/* Image with glow effect */}
              <div className="relative">
                <LDCAboutWhatIllustration className="relative w-full h-auto drop-shadow-2xl" />

                {/* Colored glow behind image */}
                <LDCDecorativeShape
                  variant="glow"
                  delay={3}
                  fill="bg-gradient-to-tr from-purple/20 via-pink/20 to-orange/20"
                />
              </div>

              {/* Pausa de la ilustración y de las formas de la sección (WCAG 2.2.2) */}
              <LDCMotionPauseButton tone="surface" className="absolute right-0 top-full mt-1" />
            </div>

            {/* Content Column - 7 columns */}
            <div className="space-y-6 lg:col-span-7">
              {/* Accent badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple/10 to-pink/10 px-4 py-2 text-sm font-medium text-purple dark:from-purple/20 dark:to-pink/20">
                <span className="flex h-2 w-2 rounded-full bg-purple" />
                Cómo funciona
              </div>

              <h2 className="text-4xl font-bold font-mulish lg:text-5xl">
                ¿Qué es{" "}
                <span className="bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent">
                  La Guía de Chile?
                </span>
              </h2>

              <p className="text-lg leading-relaxed text-foreground/70 lg:text-xl">
                Es un directorio de Chile ordenado por ciudad y región, con comercios,
                servicios, avisos clasificados, propiedades y noticias. En la página de
                cada ciudad ves además el clima y la farmacia de turno.
              </p>

              {/* Decorative accent */}
              <div className="flex gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-8 w-1 rounded-full bg-yellow" />
                  <span>Por ciudad y región</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LDCMotionPauseProvider>
  );
}
