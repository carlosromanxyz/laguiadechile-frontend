import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LDCCardWithIconAndTooltipProps {
  /** React Icons component */
  icon: IconType;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Tooltip text shown on hover */
  tooltip?: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCCardWithIconAndTooltip
 *
 * A horizontal card component with an icon, title, description, and optional tooltip.
 * Uses react-icons for flexible icon selection.
 *
 * @example
 * ```tsx
 * import { FaMapMarkerAlt } from "react-icons/fa";
 *
 * <LDCCardWithIconAndTooltip
 *   icon={FaMapMarkerAlt}
 *   title="Geolocalización"
 *   description="Descubre lugares cercanos"
 *   tooltip="Encuentra negocios cerca de ti"
 * />
 * ```
 */
export function LDCCardWithIconAndTooltip({
  icon: Icon,
  title,
  description,
  tooltip,
  className,
}: LDCCardWithIconAndTooltipProps) {
  const tooltipText = tooltip || description;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "group relative flex items-center gap-4 p-6 rounded-xl cursor-pointer",
              "bg-white/5 backdrop-blur-sm border border-white/10",
              "hover:bg-white/10 transition-all duration-300",
              "hover:border-white/20 hover:shadow-lg",
              className
            )}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate font-mulish">{title}</h3>
            </div>
          </div>
        </TooltipTrigger>
        {tooltipText && (
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
