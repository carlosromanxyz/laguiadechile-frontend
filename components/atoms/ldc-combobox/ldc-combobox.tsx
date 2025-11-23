"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { CiCircleCheck } from "react-icons/ci";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/get-icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

/**
 * LDCCombobox - Combobox Component
 *
 * A searchable combobox component built with shadcn/ui Command and Popover.
 * Used for selecting from a list of options with search functionality.
 *
 * Features:
 * - Search functionality
 * - Keyboard navigation
 * - Check mark for selected item
 * - Customizable placeholder and empty state
 * - Full width by default
 *
 * @example
 * <LDCCombobox
 *   items={cities}
 *   value={selectedCity}
 *   onValueChange={setSelectedCity}
 *   placeholder="¿En qué ciudad?"
 *   searchPlaceholder="Buscar ciudad..."
 *   emptyText="No se encontraron ciudades."
 * />
 */

interface ComboboxItem {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface LDCComboboxProps {
  items: ComboboxItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function LDCCombobox({
  items,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "No se encontraron resultados.",
  className,
}: LDCComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white/90 text-foreground",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value ? items.find((item) => item.slug === value)?.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const IconComponent = item.icon ? getIcon(item.icon) : null;
                return (
                  <CommandItem
                    value={item.name}
                    key={item.id}
                    onSelect={() => {
                      onValueChange(item.slug);
                      setOpen(false);
                    }}
                    className="justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <CiCircleCheck
                      className={cn(
                        "h-4 w-4 transition-opacity",
                        item.slug === value
                          ? "text-green-500 opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
