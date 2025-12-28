import { cn } from "@/lib/utils";

/**
 * LDCHeroText - Hero Text Component
 *
 * Displays the main hero heading with featured words highlighted using
 * sliding solid colors animation.
 *
 * Features:
 * - Responsive text sizing (mobile to desktop)
 * - Sliding solid color animation on featured words
 * - Optional subtitle
 * - Mulish font family
 * - Centered alignment
 *
 * @example
 * <LDCHeroText
 *   text="Te ayudamos a encontrar lo que buscas."
 *   featuredWords={[{ word: "encontrar" }]}
 *   subText="Encuentra los mejores lugares, comercios, servicios y más en Chile."
 * />
 */

interface FeaturedWordStyle {
  word: string;
  bgColor?: string;
  gradientColor?: string;
}

interface LDCHeroTextProps {
  text: string;
  featuredWords: FeaturedWordStyle[];
  subText?: string;
  className?: string;
}

export function LDCHeroText({
  text,
  featuredWords,
  subText,
  className,
}: LDCHeroTextProps) {
  return (
    <div className={cn("text-center lg:text-left", className)}>
      <h1 className="font-mulish mb-4 text-3xl font-bold text-white md:text-4xl lg:mb-5 lg:text-5xl">
        {text.split(" ").map((word, index) => {
          const featuredWordStyle = featuredWords.find((fw) => fw.word === word);

          return featuredWordStyle ? (
            <span key={index}>
              <span
                className="inline-block bg-clip-text text-transparent animate-color-slide-text"
                style={{
                  backgroundImage: `linear-gradient(90deg,
                    var(--color-pink) 0%, var(--color-pink) 20%,
                    var(--color-purple) 20%, var(--color-purple) 40%,
                    var(--color-yellow) 40%, var(--color-yellow) 60%,
                    var(--color-orange) 60%, var(--color-orange) 80%,
                    var(--color-pink) 80%, var(--color-pink) 100%
                  )`,
                  backgroundSize: "500% 100%",
                }}
              >
                {word}
              </span>{" "}
            </span>
          ) : (
            <span key={index}>{word} </span>
          );
        })}
      </h1>

      {subText && (
        <p className="font-open-sans text-sm text-white/90 md:text-base lg:text-lg">
          {subText}
        </p>
      )}
    </div>
  );
}
