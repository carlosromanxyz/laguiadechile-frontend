import { cn } from "@/lib/utils";
import { PANEL_BASE, PANEL_PADDING, type PanelPadding } from "@/lib/ui/layout";
import { ReactNode } from "react";

interface LDCPanelProps {
  /** Contenido */
  children: ReactNode;
  /** Padding interno: `md` = p-5, `lg` = p-6 */
  padding?: PanelPadding;
  /** Elemento HTML que se renderiza */
  as?: "div" | "section" | "aside" | "article";
  /** Clases adicionales (se agregan al final) */
  className?: string;
}

/**
 * LDCPanel - Carcasa de panel (`bg-card rounded-xl border border-border p-5`).
 *
 * @example
 * ```tsx
 * <LDCPanel>...</LDCPanel>
 * <LDCPanel as="aside" padding="lg">...</LDCPanel>
 * ```
 */
export function LDCPanel({
  children,
  padding = "md",
  as: Component = "div",
  className,
}: LDCPanelProps) {
  return (
    <Component className={cn(PANEL_BASE, PANEL_PADDING[padding], className)}>
      {children}
    </Component>
  );
}
