"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type LDCPasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

/**
 * LDCPasswordInput - Campo de contraseña con botón para mostrarla u ocultarla
 *
 * `Input` de shadcn (h-10, objetivo táctil de 40 px) con un `Button` ghost
 * dentro, a la derecha. El botón tiene un nombre fijo, «Mostrar contraseña», y
 * anuncia su estado con `aria-pressed`.
 * El resto de props (incluido `ref`, `name` y `aria-invalid`) va al `<input>`.
 *
 * @example
 * <LDCPasswordInput id="password" autoComplete="current-password" {...field} />
 */
export function LDCPasswordInput({ className, disabled, ...props }: LDCPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn("h-10 pr-11", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        aria-label="Mostrar contraseña"
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </Button>
    </div>
  );
}
