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
  /** Breadcrumb navigation items */
  breadcrumbs: BreadcrumbItem[];
  /** Icon component to display */
  icon: LucideIcon;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCListingsPageHero - Hero Section for Listing Pages
 *
 * Reusable hero component for listing pages (comercios, servicios, etc).
 * Features purple background, breadcrumbs, title, and icon.
 *
 * @example
 * ```tsx
 * <LDCListingsPageHero
 *   title="Comercios"
 *   breadcrumbs={[
 *     { label: "Inicio", href: "/" },
 *     { label: "Comercios", href: "" }
 *   ]}
 *   icon={Store}
 * />
 * ```
 */
export function LDCListingsPageHero({
  title,
  breadcrumbs,
  icon: Icon,
  className,
}: LDCListingsPageHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-purple pt-24 pb-12 md:pt-28 md:pb-16",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
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
              <h1 className="text-3xl font-bold font-mulish sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
