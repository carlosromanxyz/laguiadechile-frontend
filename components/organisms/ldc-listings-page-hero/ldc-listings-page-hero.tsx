import { cn } from "@/lib/utils";
import { LDCBreadcrumbs } from "@/components/molecules/ldc-breadcrumbs";
import { LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LDCListingsPageHeroProps {
  /** Page title */
  title: string;
  /** Page subtitle/description */
  subtitle: string;
  /** Breadcrumb navigation items */
  breadcrumbs: BreadcrumbItem[];
  /** Icon component to display */
  icon: LucideIcon;
  /** Total count of items (optional) */
  count?: number;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCListingsPageHero - Hero Section for Listing Pages
 *
 * Reusable hero component for listing pages (comercios, servicios, etc).
 * Features gradient background, breadcrumbs, title, and decorative elements.
 *
 * @example
 * ```tsx
 * <LDCListingsPageHero
 *   title="Comercios"
 *   subtitle="Descubre los mejores comercios de Chile"
 *   breadcrumbs={[
 *     { label: "Inicio", href: "/" },
 *     { label: "Comercios", href: "" }
 *   ]}
 *   icon={Store}
 *   count={24}
 * />
 * ```
 */
export function LDCListingsPageHero({
  title,
  subtitle,
  breadcrumbs,
  icon: Icon,
  count,
  className,
}: LDCListingsPageHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-gradient-to-br from-purple via-pink/90 to-orange-red py-16 md:py-20 lg:py-24",
        className
      )}
    >
      {/* Decorative background layer */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Large blur shape - top left */}
        <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple/30 via-pink/20 to-transparent blur-3xl" />

        {/* Medium blur shape - bottom right */}
        <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-gradient-to-tl from-orange/20 via-yellow/10 to-transparent blur-3xl" />

        {/* Small accent shape - floating */}
        <div className="absolute right-1/4 top-1/4 h-24 w-24 rotate-45 rounded-2xl bg-yellow/20 blur-xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Breadcrumbs */}
        <LDCBreadcrumbs items={breadcrumbs} variant="dark" className="mb-6" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Content */}
          <div className="space-y-4 text-white">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Icon className="h-7 w-7 text-white" />
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold font-mulish sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                {count !== undefined && (
                  <p className="text-sm text-white/70 mt-1">
                    {count} {count === 1 ? "resultado" : "resultados"}
                  </p>
                )}
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-white/90 max-w-2xl">{subtitle}</p>
          </div>

          {/* Decorative accents - right side */}
          <div className="hidden md:flex gap-2" aria-hidden="true">
            <div className="h-16 w-1.5 rounded-full bg-white/40" />
            <div className="h-16 w-1.5 rounded-full bg-white/25 mt-4" />
            <div className="h-16 w-1.5 rounded-full bg-white/15 mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
