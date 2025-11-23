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
 */
export function LDCCTAButton({
  href,
  onClick,
  text,
  icon,
  showIcon = true,
  disabled = false,
  className,
}: LDCCTAButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center gap-2 px-6 py-2.5 rounded-full",
    "bg-orange text-white font-semibold text-sm",
    "transition-all duration-200",
    "shadow-md",
    disabled
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-yellow hover:text-black hover:scale-105 hover:shadow-lg active:scale-95",
    className
  );

  const iconElement = showIcon && (icon ?? <FaPlus className="h-3.5 w-3.5" />);

  const content = (
    <>
      {iconElement}
      <span>{text}</span>
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
      className={baseClasses}
      type="button"
    >
      {content}
    </button>
  );
}
