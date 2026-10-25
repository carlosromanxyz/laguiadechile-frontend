import { LDCNumberBadge } from "@/components/atoms/ldc-number-badge";
import {
  LDCAccentBars,
  LDCDecorativeShape,
} from "@/components/atoms/ldc-decorative-shapes";
import Image from "next/image";

/**
 * LDCAboutWhy - "Why La Guía de Chile" Section
 *
 * Section explaining why users should use La Guía de Chile.
 * Features flowing narrative design with gradient badges and decorative elements.
 *
 * @example
 * ```tsx
 * <LDCAboutWhy />
 * ```
 */
export function LDCAboutWhy() {
  const features = [
    "Promociona tu comercio y/o servicio.",
    "Encuentra lo que necesitas.",
    "Es fácil de usar.",
    "Es gratis.",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background via-purple/5 to-background py-24 md:py-32">
      {/* Decorative shapes */}
      <LDCDecorativeShape
        variant="blob"
        layout="bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2"
        fill="bg-gradient-to-tr from-orange/10 via-yellow/10 to-transparent"
      />
      <LDCDecorativeShape
        variant="spot"
        layout="right-20 top-20 h-20 w-20 rotate-12 rounded-lg"
        fill="bg-pink/20"
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Content Column - 7 columns */}
          <div className="space-y-8 lg:col-span-7">
            <div>
              {/* Accent badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange/10 to-yellow/10 px-4 py-2 text-sm font-medium text-orange-red dark:from-orange/20 dark:to-yellow/20">
                <span className="flex h-2 w-2 rounded-full bg-orange" />
                Beneficios
              </div>

              <h2 className="text-4xl font-bold font-mulish lg:text-5xl">
                ¿Por qué estar en{" "}
                <span className="bg-gradient-to-r from-orange via-orange-red to-pink bg-clip-text text-transparent">
                  La Guía de Chile?
                </span>
              </h2>
            </div>

            {/* Features List - Enhanced with gradient badges */}
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li key={index} className="group flex items-start gap-4">
                  {/* Gradient Number Badge */}
                  <LDCNumberBadge
                    number={index + 1}
                    variant="gradient"
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
                { width: "w-12", fill: "bg-gradient-to-r from-purple to-pink" },
                { width: "w-8", fill: "bg-gradient-to-r from-orange to-yellow" },
                { width: "w-4", fill: "bg-blue-gray" },
              ]}
            />
          </div>

          {/* Image Column - 5 columns */}
          <div className="relative lg:col-span-5">
            {/* Colored accent shape - corner */}
            <LDCDecorativeShape
              variant="corner"
              layout="-right-6 -top-6 h-24 w-24 rotate-12"
              fill="from-yellow to-orange"
            />

            <div className="relative">
              <Image
                src="/images/about-why-illustration.svg"
                alt="¿Por qué estar en La Guía de Chile? - Crece tu negocio"
                width={540}
                height={478}
                className="relative w-full h-auto drop-shadow-2xl"
              />

              {/* Colored glow */}
              <LDCDecorativeShape
                variant="glow"
                fill="bg-gradient-to-bl from-orange/20 via-yellow/20 to-pink/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
