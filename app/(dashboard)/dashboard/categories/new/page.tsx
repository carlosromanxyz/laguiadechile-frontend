import { CategoryForm } from "../_components/category-form";

export const metadata = {
  title: "Nueva categoría — Dashboard",
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nueva categoría</h1>
        <p className="text-sm text-muted-foreground">
          Define el nombre, slug y datos asociados.
        </p>
      </div>
      <CategoryForm mode="create" />
    </div>
  );
}
