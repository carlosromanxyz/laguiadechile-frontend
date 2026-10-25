import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCSectionHeader } from "@/components/molecules/ldc-section-header";
import { LDCCategoryCard } from "@/components/molecules/ldc-category-card";
import type { IFeaturedCategories } from "@/interfaces/featured-category";

interface LDCFeaturedCategoriesProps {
  categories: IFeaturedCategories;
}

/**
 * LDCFeaturedCategories - Featured Categories Section
 *
 * Displays a grid of featured category cards on the home page.
 * Server Component: recibe los datos por props (los carga la home).
 *
 * Features:
 * - Responsive grid layout (2 → 3 → 4 columns)
 * - Animated cards with hover effects
 * - Category data passed in by props
 * - Gradient icons with brand colors
 *
 * @example
 * ```tsx
 * <LDCFeaturedCategories categories={categories} />
 * ```
 */
export function LDCFeaturedCategories({ categories }: LDCFeaturedCategoriesProps) {
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
