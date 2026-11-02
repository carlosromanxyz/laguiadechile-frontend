import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface LDCCTAButtonProps {
  /**
   * URL to navigate to (uses Next.js Link)
   * If not provided, renders as a button element
   */
  href?: string;

  /**
   * Click handler for button actions
   * Only used when href is not provided
   */
  onClick?: () => void;

  /**
   * Button text content
   */
  text: string;

  /**
   * Optional icon to display before the text
   * Defaults to FaPlus if not provided
   */
  icon?: React.ReactNode;

  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Tipo del `<button>` (sin `href`). `submit` envía el formulario que lo contiene.
   * @default "button"
   */
  type?: "button" | "submit";

  /**
   * Estado de carga: muestra un spinner en lugar del ícono, deshabilita el
   * botón y marca `aria-busy`. Nunca se renderiza como enlace.
   * @default false
   */
  loading?: boolean;

  /**
   * Texto mientras `loading` (si no se da, se mantiene `text`)
   */
  loadingText?: string;

  /**
   * `default`: rosado intenso con texto blanco (5,23:1). `contrast`: naranjo con
   * texto negro (8,9:1); lo usan el login y el registro.
   * @default "default"
   */
  variant?: "default" | "contrast";

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LDCCTAButton - Call-to-Action Button Component
 *
 * A prominent button component with La Guía de Chile branding.
 * Rosado intenso (`bg-pink-strong`) con texto blanco, hover amarillo con texto negro
 * y anillo de foco rosado en claro y amarillo en oscuro.
 * Can be used as a link (Next.js Link) or a button element.
 *
 * @example
 * // As a link
 * <LDCCTAButton text="Publicar" href="/publicar" />
 *
 * @example
 * // As a button with custom icon
 * <LDCCTAButton text="Guardar" onClick={handleSubmit} icon={<FaSave />} />
 *
 * @example
 * // Without icon
 * <LDCCTAButton text="Contactar" href="/contacto" showIcon={false} />
 *
 * @example
 * // Envío de formulario con estado de carga y texto negro
 * <LDCCTAButton type="submit" variant="contrast" loading={sending} loadingText="Enviando…" text="Enviar" showIcon={false} />
 */
export function LDCCTAButton({
  href,
  onClick,
  text,
  icon,
  showIcon = true,
  disabled: disabledProp = false,
  type = "button",
  loading = false,
  loadingText,
  variant = "default",
  className,
}: LDCCTAButtonProps) {
  const disabled = disabledProp || loading;
  const baseClasses = cn(
    "inline-flex items-center gap-2 px-6 py-2.5 rounded-full",
    variant === "contrast"
      ? "bg-orange text-black font-semibold text-sm"
      : "bg-pink-strong text-white font-semibold text-sm",
    "transition-[transform,background-color,color] duration-200 motion-reduce:transition-none",
    "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink dark:focus-visible:outline-yellow",
    disabled
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-yellow hover:text-black hover:scale-105 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
    className
  );

  const iconElement = loading ? (
    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
  ) : (
    showIcon && (icon ?? <FaPlus className="h-3.5 w-3.5" />)
  );

  const content = (
    <>
      {iconElement}
      <span>{loading && loadingText ? loadingText : text}</span>
    </>
  );

  // Render as Link if href is provided
  if (href && !disabled) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading || undefined}
      className={baseClasses}
      type={type}
    >
      {content}
    </button>
  );
}
