import { cn } from "@/lib/utils";
import { LDCBreadcrumbs } from "@/components/molecules/ldc-breadcrumbs";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { getIcon } from "@/lib/get-icon";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { IClassified, ClassifiedType } from "@/interfaces/classified";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LDCClassifiedDetailHeroProps {
  classified: IClassified;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

const typeLabels: Record<ClassifiedType, string> = {
  vendo: "VENDO",
  compro: "COMPRO",
  arriendo: "ARRIENDO",
  busco: "BUSCO",
  ofrezco: "OFREZCO",
};

const typeColors: Record<ClassifiedType, string> = {
  vendo: "bg-pink text-white",
  compro: "bg-purple text-white",
  arriendo: "bg-orange text-white",
  busco: "bg-yellow text-black",
  ofrezco: "bg-emerald-500 text-white",
};

/**
 * LDCClassifiedDetailHero - Hero Section for Classified Detail Pages
 *
 * Mirrors LDCListingDetailHero but for classifieds: shows the classified type
 * badge (VENDO/ARRIENDO/...), category, title, location and share buttons.
 */
export function LDCClassifiedDetailHero({
  classified,
  breadcrumbs,
  className,
}: LDCClassifiedDetailHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-purple/20 pt-24 pb-8 md:pt-28 md:pb-12",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumbs */}
        <LDCBreadcrumbs items={breadcrumbs} variant="light" className="mb-6" />

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mulish",
              typeColors[classified.type]
            )}
          >
            {typeLabels[classified.type]}
          </span>
          {classified.featured && (
            <LDCBadge variant="featured">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacado
            </LDCBadge>
          )}
          <LDCBadge variant="default">
            {renderCategoryIcon(classified.category.icon)}
            {classified.category.name}
          </LDCBadge>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-mulish text-foreground mb-4">
          {classified.title}
        </h1>

        {/* Location & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href={`/ciudad/${classified.city.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="w-5 h-5 text-pink" />
            <span className="text-lg">
              {classified.commune ? `${classified.commune}, ` : ""}
              {classified.city.name}
            </span>
          </Link>

          <LDCSocialShareButtons title={classified.title} variant="dark" />
        </div>
      </div>
    </section>
  );
}

// Helper function to render icon - keeps component creation out of render
function renderCategoryIcon(iconName?: string): React.ReactNode {
  const Icon = iconName ? getIcon(iconName) : null;
  return Icon ? <Icon className="w-3 h-3 mr-1" /> : null;
}
