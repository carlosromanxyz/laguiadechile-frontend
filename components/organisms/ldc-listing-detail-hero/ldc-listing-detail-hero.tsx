import { LDCPageHero } from "@/components/organisms/ldc-page-hero";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { getIcon } from "@/lib/get-icon";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { IListingDetail } from "@/interfaces/listing";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";

interface LDCListingDetailHeroProps {
  listing: IListingDetail;
  breadcrumbs: IBreadcrumbItem[];
  className?: string;
}

/**
 * LDCListingDetailHero - Hero Section for Listing Detail Pages
 *
 * Displays the hero section with title, category badge, location, and share buttons.
 * Uses the same purple background style as other listing pages.
 */
export function LDCListingDetailHero({
  listing,
  breadcrumbs,
  className,
}: LDCListingDetailHeroProps) {
  return (
    <LDCPageHero breadcrumbs={breadcrumbs} className={className}>
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {listing.featured && (
          <LDCBadge variant="featured">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Destacado
          </LDCBadge>
        )}
        <LDCBadge variant="default">
          {renderCategoryIcon(listing.category.icon)}
          {listing.category.name}
        </LDCBadge>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-mulish text-foreground mb-4">
        {listing.title}
      </h1>

      {/* Location & Share */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href={`/ciudad/${listing.city.slug}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MapPin className="w-5 h-5 text-pink" />
          <span className="text-lg">
            {listing.commune ? `${listing.commune}, ` : ""}
            {listing.city.name}
          </span>
        </Link>

        <LDCSocialShareButtons title={listing.title} variant="dark" />
      </div>
    </LDCPageHero>
  );
}

// Helper function to render icon - keeps component creation out of render
function renderCategoryIcon(iconName?: string): React.ReactNode {
  const Icon = iconName ? getIcon(iconName) : null;
  return Icon ? <Icon className="w-3 h-3 mr-1" /> : null;
}
