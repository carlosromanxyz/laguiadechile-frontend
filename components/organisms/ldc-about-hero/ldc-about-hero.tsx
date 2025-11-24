import Image from "next/image";

/**
 * LDCAboutHero - About Page Hero Section
 *
 * Full-screen hero section for the About page with gradient background,
 * title, description, and illustration.
 *
 * @example
 * ```tsx
 * <LDCAboutHero />
 * ```
 */
export function LDCAboutHero() {
  return (
    <section className="flex min-h-screen items-center bg-gradient-to-tr from-purple to-pink">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column - Text */}
          <div className="col-span-1 flex flex-col justify-center text-center text-white md:text-start">
            <h1 className="mb-4 text-4xl font-bold font-mulish">
              Promociona tu comercio y/o servicio, también puedes encontrar lo que buscas.
            </h1>
            <p className="text-lg">
              La Guía de Chile es una plataforma que te permite promocionar tu comercio y/o servicio, también puedes encontrar lo que necesitas.
            </p>
          </div>

          {/* Right Column - Illustration */}
          <div className="col-span-1 flex items-center justify-center">
            <Image
              src="/images/about-illustration.png"
              alt="La Guía de Chile - Ilustración"
              width={540}
              height={478}
              className="mt-6 w-full h-auto md:mt-0"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
