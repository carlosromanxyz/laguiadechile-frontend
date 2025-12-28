import { cn } from "@/lib/utils";
import { LDCBreadcrumbs } from "@/components/molecules/ldc-breadcrumbs";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { getIcon } from "@/lib/get-icon";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { IListingDetail } from "@/interfaces/listing";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LDCListingDetailHeroProps {
  listing: IListingDetail;
  breadcrumbs: BreadcrumbItem[];
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
  const CategoryIcon = getIcon(listing.category.icon);

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
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.featured && (
            <LDCBadge variant="featured">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacado
            </LDCBadge>
          )}
          <LDCBadge variant="default">
            {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1" />}
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
      </div>
    </section>
  );
}
