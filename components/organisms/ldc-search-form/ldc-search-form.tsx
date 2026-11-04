"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Search } from "lucide-react";
import { searchFormSchema } from "@/validations/search-form-schema";
import { ICategory } from "@/interfaces/category";
import { ICity } from "@/interfaces/city";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LDCCombobox } from "@/components/molecules/ldc-combobox";

/**
 * LDCSearchForm - Search Form Component
 *
 * A comprehensive search form with text input and two comboboxes for category and city selection.
 * Uses React Hook Form with Zod validation and shadcn/ui components.
 *
 * Features:
 * - Text input for free-form search
 * - Category combobox with search functionality
 * - City combobox with search functionality
 * - Form validation with Zod
 * - Responsive grid layout
 * - Glassmorphism design with backdrop blur
 * - Gradient submit button
 *
 * @example
 * <LDCSearchForm categories={categories} cities={cities} />
 */

interface LDCSearchFormProps {
  categories: ICategory[];
  cities: ICity[];
}

export function LDCSearchForm({ categories, cities }: LDCSearchFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchTerm: "",
      searchCategory: "",
      searchCity: "",
    },
  });

  // Watch form values to enable/disable submit button
  const searchTerm = form.watch("searchTerm");
  const searchCategory = form.watch("searchCategory");
  const searchCity = form.watch("searchCity");

  const isFormEmpty = !searchTerm && !searchCategory && !searchCity;

  function onSubmit(values: z.infer<typeof searchFormSchema>) {
    // URLSearchParams codifica tildes, espacios, `&` y `?`; los campos vacíos no van en la URL.
    const params = new URLSearchParams();
    if (values.searchTerm) params.set("term", values.searchTerm);
    if (values.searchCategory) params.set("category", values.searchCategory);
    if (values.searchCity) params.set("city", values.searchCity);
    router.push(`/resultados?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        className="relative grid grid-cols-1 gap-4 rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Search Term Input */}
        <FormField
          control={form.control}
          name="searchTerm"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <Input
                  placeholder="¿Qué buscas hoy en Chile?"
                  type="text"
                  className="bg-white/90 text-foreground placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Combobox */}
        <FormField
          control={form.control}
          name="searchCategory"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormControl>
                <LDCCombobox
                  items={categories}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="¿En qué categoría?"
                  searchPlaceholder="Buscar categoría..."
                  emptyText="No se encontraron categorías."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City Combobox */}
        <FormField
          control={form.control}
          name="searchCity"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormControl>
                <LDCCombobox
                  items={cities}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="¿En qué ciudad?"
                  searchPlaceholder="Buscar ciudad..."
                  emptyText="No se encontraron ciudades."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isFormEmpty}
          className="col-span-2 cursor-pointer bg-pink-strong text-white transition-[background-color,color] duration-200 hover:bg-yellow hover:text-black focus-visible:ring-0 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search className="mr-2 h-4 w-4" />
          Buscar en La Guía de Chile
        </Button>
      </form>
    </Form>
  );
}
