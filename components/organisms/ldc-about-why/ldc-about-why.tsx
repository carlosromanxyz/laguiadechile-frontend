import { LDCNumberBadge } from "@/components/atoms/ldc-number-badge";
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
      <div
        className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-orange/10 via-yellow/10 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute right-20 top-20 h-20 w-20 rotate-12 rounded-lg bg-pink/20 blur-xl"
        aria-hidden="true"
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
            <div className="flex gap-2 pt-4" aria-hidden="true">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple to-pink" />
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-orange to-yellow" />
              <div className="h-1 w-4 rounded-full bg-blue-gray" />
            </div>
          </div>

          {/* Image Column - 5 columns */}
          <div className="relative lg:col-span-5">
            {/* Colored accent shape - corner */}
            <div
              className="absolute -right-6 -top-6 h-24 w-24 rotate-12 rounded-2xl bg-gradient-to-br from-yellow to-orange opacity-60 blur-md"
              aria-hidden="true"
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
              <div
                className="absolute inset-0 -z-10 scale-110 bg-gradient-to-bl from-orange/20 via-yellow/20 to-pink/20 blur-2xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
