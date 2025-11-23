/**
 * LDCComingSoon - Coming Soon Component
 *
 * Simple centered message component for pages under construction.
 * Displays "Próximamente" with a clean, minimal design.
 *
 * Features:
 * - Full viewport height
 * - Centered content
 * - Responsive text sizing
 * - Clean, minimal design
 *
 * @example
 * <LDCComingSoon />
 */

export function LDCComingSoon() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
        Próximamente
      </h1>
    </div>
  );
}
