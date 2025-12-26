import { LDCSection } from "@/components/organisms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCCategoryCard } from "@/components/molecules/ldc-category-card";
import { getFeaturedCategories } from "@/services/featured-categories";

/**
 * LDCFeaturedCategories - Featured Categories Section
 *
 * Displays a grid of featured category cards on the home page.
 * Server Component that fetches category data from JSON.
 *
 * Features:
 * - Responsive grid layout (2 → 3 → 4 columns)
 * - Animated cards with hover effects
 * - Dynamic category data from JSON
 * - Gradient icons with brand colors
 *
 * @example
 * ```tsx
 * <LDCFeaturedCategories />
 * ```
 */
export function LDCFeaturedCategories() {
  const categories = getFeaturedCategories();

  return (
    <LDCSection>
      <LDCSectionHeader
        title="Categorías destacadas"
        subtitle="Explora nuestras categorías más populares"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <LDCCategoryCard
            key={category.id}
            name={category.name}
            slug={category.slug}
            count={category.count}
            iconName={category.icon}
            gradient={category.gradient}
          />
        ))}
      </div>
    </LDCSection>
  );
}
