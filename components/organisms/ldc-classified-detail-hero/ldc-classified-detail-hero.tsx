import { LDCDetailHero } from "@/components/organisms/ldc-detail-hero";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { getIcon } from "@/lib/get-icon";
import { getClassifiedTypeBadgeLabel } from "@/lib/format/classifieds";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { IClassified } from "@/interfaces/classified";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";

interface LDCClassifiedDetailHeroProps {
  classified: IClassified;
  breadcrumbs: IBreadcrumbItem[];
  className?: string;
}

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
    <LDCDetailHero breadcrumbs={breadcrumbs} className={className}>
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Mismas clases que antes: la variante pone color, texto y peso; className, la forma de pill */}
        <LDCBadge
          variant={`classified-${classified.type}`}
          className="inline-flex items-center px-2.5 py-1 rounded-md font-mulish"
        >
          {getClassifiedTypeBadgeLabel(classified.type)}
        </LDCBadge>
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
    </LDCDetailHero>
  );
}

// Helper function to render icon - keeps component creation out of render
function renderCategoryIcon(iconName?: string): React.ReactNode {
  const Icon = iconName ? getIcon(iconName) : null;
  return Icon ? <Icon className="w-3 h-3 mr-1" /> : null;
}
