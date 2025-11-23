import { cn } from "@/lib/utils";

/**
 * LDCHeroText - Hero Text Component
 *
 * Displays the main hero heading with a featured word highlighted using
 * the brand gradient (orange to pink).
 *
 * Features:
 * - Responsive text sizing (mobile to desktop)
 * - Gradient highlight on featured word
 * - Optional subtitle
 * - Mulish font family
 * - Centered alignment
 *
 * @example
 * <LDCHeroText
 *   text="Te ayudamos a encontrar lo que buscas."
 *   featuredWord="encontrar"
 *   subText="Encuentra los mejores lugares, comercios, servicios y más en Chile."
 * />
 */

interface LDCHeroTextProps {
  text: string;
  featuredWord: string;
  subText?: string;
  className?: string;
}

export function LDCHeroText({
  text,
  featuredWord,
  subText,
  className,
}: LDCHeroTextProps) {
  return (
    <div className={cn("text-center lg:text-left", className)}>
      <h1 className="font-mulish mb-4 text-4xl font-bold text-white md:text-5xl lg:mb-5 lg:text-7xl">
        {text.split(" ").map((word, index) => {
          return word === featuredWord ? (
            <span
              key={index}
              className="bg-gradient-to-tr from-orange to-pink bg-clip-text text-transparent"
            >
              {word}{" "}
            </span>
          ) : (
            <span key={index}>{word} </span>
          );
        })}
      </h1>

      {subText && (
        <p className="font-open-sans text-base text-white/90 md:text-xl lg:text-3xl">
          {subText}
        </p>
      )}
    </div>
  );
}
