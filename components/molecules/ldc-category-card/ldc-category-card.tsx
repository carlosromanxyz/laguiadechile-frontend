"use client";

import { cn } from "@/lib/utils";
import { LDCCategoryIcon } from "@/components/atoms/ldc-category-icon";
import Link from "next/link";
import { motion } from "framer-motion";

interface LDCCategoryCardProps {
  /** Category name */
  name: string;
  /** Category slug for URL */
  slug: string;
  /** Number of listings in this category */
  count: number;
  /** Icon name from Lucide */
  iconName: string;
  /** Gradient colors */
  gradient: {
    from: string;
    to: string;
  };
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCCategoryCard - Featured Category Card Component
 *
 * Interactive card displaying a category with icon, name, and listing count.
 * Features hover animations and gradient background on hover.
 *
 * @example
 * ```tsx
 * <LDCCategoryCard
 *   name="Restaurantes"
 *   slug="restaurantes"
 *   count={1247}
 *   iconName="UtensilsCrossed"
 *   gradient={{ from: "orange", to: "yellow" }}
 * />
 * ```
 */
export function LDCCategoryCard({
  name,
  slug,
  count,
  iconName,
  gradient,
  className,
}: LDCCategoryCardProps) {
  return (
    <motion.div
      className={cn("group h-full", className)}
    >
      <Link
        href={`/categoria/${slug}`}
        className={cn(
          "relative block h-full p-6 rounded-xl overflow-hidden",
          "bg-card border border-border",
          "transition-all duration-300",
          "hover:border-purple/50"
        )}
      >
        {/* Content */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <LDCCategoryIcon iconName={iconName} gradient={gradient} />

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-bold text-lg font-mulish mb-1 truncate",
                "text-foreground transition-colors duration-300",
                "group-hover:text-purple dark:group-hover:text-yellow"
              )}
            >
              {name}
            </h3>
            <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-purple/80 dark:group-hover:text-yellow/80">
              {count > 1 ? `${count.toLocaleString('es-CL')} publicaciones` : "1 publicación"}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
