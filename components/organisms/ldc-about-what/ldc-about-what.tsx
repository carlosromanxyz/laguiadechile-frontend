import Image from "next/image";

/**
 * LDCAboutWhat - "What is La Guía de Chile" Section
 *
 * Section explaining what La Guía de Chile is.
 * Features flowing narrative design with gradient backgrounds and decorative elements.
 *
 * @example
 * ```tsx
 * <LDCAboutWhat />
 * ```
 */
export function LDCAboutWhat() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-pink/5 via-background to-background py-24 md:py-32">
      {/* Decorative shape - top right */}
      <div
        className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-yellow/20 to-orange/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Image Column - 5 columns */}
          <div className="relative lg:col-span-5">
            {/* Colored accent bar */}
            <div
              className="absolute -left-4 top-8 h-32 w-2 rounded-full bg-gradient-to-b from-purple to-pink"
              aria-hidden="true"
            />

            {/* Image with glow effect */}
            <div className="relative">
              <Image
                src="/images/about-what-illustration.svg"
                alt="¿Qué es La Guía de Chile? - Busca y descubre negocios"
                width={540}
                height={478}
                className="relative w-full h-auto drop-shadow-2xl"
              />

              {/* Colored glow behind image */}
              <div
                className="absolute inset-0 -z-10 scale-110 bg-gradient-to-tr from-purple/20 via-pink/20 to-orange/20 blur-2xl"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Content Column - 7 columns */}
          <div className="space-y-6 lg:col-span-7">
            {/* Accent badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple/10 to-pink/10 px-4 py-2 text-sm font-medium text-purple dark:from-purple/20 dark:to-pink/20">
              <span className="flex h-2 w-2 rounded-full bg-purple" />
              Sobre nosotros
            </div>

            <h2 className="text-4xl font-bold font-mulish lg:text-5xl">
              ¿Qué es{" "}
              <span className="bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent">
                La Guía de Chile?
              </span>
            </h2>

            <p className="text-lg leading-relaxed text-foreground/70 lg:text-xl">
              La Guía de Chile es una plataforma que te permite promocionar tu
              comercio y/o servicio, también puedes encontrar lo que necesitas.
            </p>

            {/* Decorative accent */}
            <div className="flex gap-3 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-8 w-1 rounded-full bg-yellow" />
                <span>Conectando Chile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
