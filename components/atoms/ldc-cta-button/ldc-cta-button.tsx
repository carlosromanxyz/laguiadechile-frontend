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
   * Tono del texto sobre el naranjo. `contrast` usa texto negro (8,9:1 en vez
   * de 2,4:1 del blanco). Por ahora solo lo usa el login.
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
 * Features orange background with yellow hover state and smooth transitions.
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
      : "bg-orange text-white font-semibold text-sm",
    "transition-all duration-200",
    disabled
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-yellow hover:text-black hover:scale-105 active:scale-95",
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
