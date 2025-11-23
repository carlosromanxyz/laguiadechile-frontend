import { cn } from "@/lib/utils";

/**
 * LDCFooterTitle - Footer Section Title Component
 *
 * Displays a section title for footer widgets with:
 * - Mulish font family
 * - Colored underline that transitions from pink to orange on hover
 * - Smooth color transitions
 *
 * Features:
 * - Uses Mulish font (primary brand font)
 * - Bar changes color on hover (desktop and mobile)
 * - Responsive text sizing
 * - Proper semantic heading structure
 *
 * @example
 * <LDCFooterTitle>Nosotros</LDCFooterTitle>
 */

interface LDCFooterTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function LDCFooterTitle({ children, className }: LDCFooterTitleProps) {
  return (
    <div className={cn("mb-4", className)}>
      <h3 className="font-mulish text-xl font-bold text-blue-gray dark:text-white">
        {children}
      </h3>
      <div className="mt-2 h-1 w-16 rounded-full bg-pink transition-colors duration-500 group-hover:bg-orange" />
    </div>
  );
}
