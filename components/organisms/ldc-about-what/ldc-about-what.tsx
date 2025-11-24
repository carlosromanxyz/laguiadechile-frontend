import { LDCSection } from "@/components/organisms/ldc-section";
import Image from "next/image";

/**
 * LDCAboutWhat - "What is La Guía de Chile" Section
 *
 * Section explaining what La Guía de Chile is.
 * Features image on left and text content on right.
 *
 * @example
 * ```tsx
 * <LDCAboutWhat />
 * ```
 */
export function LDCAboutWhat() {
  return (
    <LDCSection paddingY="xl" className="bg-background">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column - Image */}
        <div className="col-span-1 flex items-center justify-center">
          <Image
            src="/images/about-img-1.png"
            alt="¿Qué es La Guía de Chile?"
            width={540}
            height={478}
            className="w-full h-auto"
          />
        </div>

        {/* Right Column - Text */}
        <div className="col-span-1 flex flex-col justify-center">
          <h2 className="mb-4 text-4xl font-bold font-mulish">
            ¿Qué es La Guía de Chile?
          </h2>
          <p className="text-lg text-foreground/80">
            La Guía de Chile es una plataforma que te permite promocionar tu comercio y/o servicio, también puedes encontrar lo que necesitas.
          </p>
        </div>
      </div>
    </LDCSection>
  );
}
