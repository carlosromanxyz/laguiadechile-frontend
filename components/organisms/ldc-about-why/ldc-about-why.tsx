import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCFeatureListItem } from "@/components/molecules/ldc-feature-list-item";
import Image from "next/image";

/**
 * LDCAboutWhy - "Why La Guía de Chile" Section
 *
 * Section explaining why users should use La Guía de Chile.
 * Features numbered list on left and image on right.
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
    <LDCSection paddingY="xl">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column - Features List */}
        <div className="col-span-1">
          <h2 className="mb-8 text-4xl font-bold font-mulish">
            ¿Por qué estar en La Guía de Chile?
          </h2>
          <ul className="mt-6">
            {features.map((feature, index) => (
              <LDCFeatureListItem
                key={index}
                number={index + 1}
                text={feature}
              />
            ))}
          </ul>
        </div>

        {/* Right Column - Image */}
        <div className="col-span-1 flex items-center justify-center">
          <Image
            src="/images/about-img-2.png"
            alt="¿Por qué estar en La Guía de Chile?"
            width={540}
            height={478}
          />
        </div>
      </div>
    </LDCSection>
  );
}
