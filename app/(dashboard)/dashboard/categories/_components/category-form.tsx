"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/(dashboard)/dashboard/categories/actions";

const schema = z.object({
  name: z.string().min(1, "Requerido").max(200),
  slug: z
    .string()
    .min(1, "Requerido")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof schema>;

export interface CategoryFormProps {
  mode: "create" | "edit";
  id?: string;
  initial?: Partial<CategoryFormValues>;
}

export function CategoryForm({ mode, id, initial }: CategoryFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      icon: initial?.icon ?? "",
    },
  });

  function onSubmit(values: CategoryFormValues) {
    startTransition(async () => {
      try {
        const payload = {
          name: values.name,
          slug: values.slug,
          description: values.description?.trim() || null,
          icon: values.icon?.trim() || null,
        };
        if (mode === "create") {
          await createCategoryAction(payload);
          toast.success("Categoría creada");
        } else if (id) {
          await updateCategoryAction(id, payload);
          toast.success("Categoría actualizada");
        }
        router.push("/dashboard/categories");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al guardar");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-2xl gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Restaurantes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="restaurantes" {...field} />
              </FormControl>
              <FormDescription>
                Identificador único en la URL (minúsculas, guiones).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícono</FormLabel>
              <FormControl>
                <Input placeholder="MdRestaurant" {...field} />
              </FormControl>
              <FormDescription>
                Nombre de un ícono de react-icons/md o lucide. Opcional.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard/categories")}
            disabled={pending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
