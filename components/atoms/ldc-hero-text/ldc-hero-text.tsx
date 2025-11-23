"use client";

import { motion } from "framer-motion";
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

interface FeaturedWordStyle {
  word: string;
  bgColor: string;
  gradientColor: string;
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
  // Map Tailwind color names to CSS color values
  const getColorValue = (colorName: string) => {
    const colorMap: Record<string, string> = {
      yellow: 'oklch(0.82 0.15 85)',
      orange: 'oklch(0.75 0.18 55)',
      pink: 'oklch(0.62 0.28 350)',
      purple: 'oklch(0.58 0.24 290)',
      green: 'oklch(0.70 0.20 145)',
    };
    return colorMap[colorName] || colorName;
  };

  return (
    <div className={cn("text-center lg:text-left", className)}>
      <h1 className="font-mulish mb-4 text-3xl font-bold text-white md:text-4xl lg:mb-5 lg:text-5xl">
        {text.split(" ").map((word, index) => {
          const featuredWordStyle = featuredWords.find((fw) => fw.word === word);

          return featuredWordStyle ? (
            <span key={index}>
              <span className="relative inline-block">
                <span className={cn(featuredWordStyle.bgColor, "bg-clip-text text-transparent")}>
                  {word}
                </span>
                <motion.span
                  className="absolute inset-0 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${getColorValue(featuredWordStyle.gradientColor)}, transparent)`,
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['200% 0', '-200% 0'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {word}
                </motion.span>
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
