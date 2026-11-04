import { LDCNumberBadge } from "@/components/atoms/ldc-number-badge";
import {
  LDCAccentBars,
  LDCDecorativeShape,
} from "@/components/atoms/ldc-decorative-shapes";
import { LDCMotionPauseButton } from "@/components/atoms/ldc-motion-pause-button";
import { LDCMotionPauseProvider } from "@/components/shared/ldc-motion-pause-provider";
import { LDCAboutWhyIllustration } from "@/components/molecules/ldc-about-why-illustration";

/**
 * LDCAboutWhy - "Why La Guía de Chile" Section
 *
 * Section explaining why users should use La Guía de Chile.
 * Features flowing narrative design with flat number badges and decorative elements,
 * and an animated illustration (LDCAboutWhyIllustration) with a pause button
 * (WCAG 2.2.2) that freezes it and the decorative shapes of the section through
 * LDCMotionPauseProvider; hidden with prefers-reduced-motion. The button is
 * absolutely positioned under the illustration, so it does not change the layout.
 *
 * @example
 * ```tsx
 * <LDCAboutWhy />
 * ```
 */
export function LDCAboutWhy() {
  const features = [
    "Creas tu cuenta y completas la ficha en el panel.",
    "Revisamos cada ficha antes de publicarla.",
    "Con la misma cuenta puedes publicar avisos clasificados.",
    "Publicar no tiene costo.",
  ];

  return (
    <LDCMotionPauseProvider>
      <section className="relative w-full overflow-hidden bg-background py-24 md:py-32">
        {/* Decorative shapes */}
        <LDCDecorativeShape
          variant="blob"
          delay={0}
          layout="bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2"
          fill="bg-orange/10"
        />
        <LDCDecorativeShape
          variant="spot"
          delay={2.5}
          layout="right-20 top-20 h-20 w-20 rotate-12 rounded-lg"
          fill="bg-pink/20"
        />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Content Column - 7 columns */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                {/* Accent badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-pink-strong/5 px-4 py-2 text-sm font-medium text-pink-strong dark:bg-yellow/10 dark:text-yellow">
                  <span className="flex h-2 w-2 rounded-full bg-pink-strong dark:bg-yellow" />
                  Para quien publica
                </div>

                <h2 className="text-4xl font-bold font-mulish lg:text-5xl">
                  Si tienes un{" "}
                  <span className="text-pink-strong whitespace-nowrap dark:text-yellow">
                    comercio o servicio
                  </span>
                </h2>
              </div>

              {/* Features List - flat number badges */}
              <ul className="space-y-6">
                {features.map((feature, index) => (
                  <li key={index} className="group flex items-start gap-4">
                    {/* Number Badge */}
                    <LDCNumberBadge
                      number={index + 1}
                      variant="solid"
                      className="flex-shrink-0 transition-transform group-hover:scale-110"
                    />

                    {/* Feature Text */}
                    <div className="flex-1 pt-2">
                      <p className="text-lg font-medium leading-relaxed lg:text-xl">
                        {feature}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Decorative accent bars */}
              <LDCAccentBars
                bars={[
                  { width: "w-12", fill: "bg-purple" },
                  { width: "w-8", fill: "bg-orange" },
                  { width: "w-4", fill: "bg-blue-gray" },
                ]}
              />
            </div>

            {/* Image Column - 5 columns */}
            <div className="relative lg:col-span-5">
              {/* Colored accent shape - corner */}
              <LDCDecorativeShape
                variant="corner"
                delay={1}
                layout="-right-6 -top-6 h-24 w-24 rotate-12"
                fill="bg-yellow"
              />

              <div className="relative">
                <LDCAboutWhyIllustration className="relative w-full h-auto drop-shadow-2xl" />

                {/* Colored glow */}
                <LDCDecorativeShape
                  variant="glow"
                  delay={3.5}
                  fill="bg-orange/20"
                />
              </div>

              {/* Pausa de la ilustración y de las formas de la sección (WCAG 2.2.2) */}
              <LDCMotionPauseButton tone="surface" className="absolute right-0 top-full mt-1" />
            </div>
          </div>
        </div>
      </section>
    </LDCMotionPauseProvider>
  );
}
