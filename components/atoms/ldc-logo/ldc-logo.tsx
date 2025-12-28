import { cn } from "@/lib/utils";
import { FaMapMarkerAlt } from "react-icons/fa";

interface LDCLogoProps {
  className?: string;
  isotipoSize?: "xs" | "sm" | "md" | "lg";
}

export function LDCLogo({ className, isotipoSize = "lg" }: LDCLogoProps) {
  // Size configurations for isotipo and text
  const sizeConfig = {
    xs: {
      container: "w-9 h-9",
      icon: "w-5 h-5",
      textSize: "text-base",
      gap: "gap-1.5",
    },
    sm: {
      container: "w-12 h-12",
      icon: "w-7 h-7",
      textSize: "text-xl",
      gap: "gap-2",
    },
    md: {
      container: "w-14 h-14",
      icon: "w-8 h-8",
      textSize: "text-2xl",
      gap: "gap-2",
    },
    lg: {
      container: "w-16 h-16",
      icon: "w-10 h-10",
      textSize: "text-2xl",
      gap: "gap-2",
    },
  };

  const config = sizeConfig[isotipoSize];

  return (
    <div className={cn("flex items-center", config.gap, className)}>
      {/* Isotipo - Map Pin Icon with sliding solid colors */}
      <div className={cn("relative rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden", config.container)}>
        <div
          className="absolute inset-0 animate-color-slide"
          style={{
            background: `linear-gradient(90deg,
              var(--color-pink) 0%, var(--color-pink) 20%,
              var(--color-purple) 20%, var(--color-purple) 40%,
              var(--color-yellow) 40%, var(--color-yellow) 60%,
              var(--color-orange) 60%, var(--color-orange) 80%,
              var(--color-pink) 80%, var(--color-pink) 100%
            )`,
            backgroundSize: "500% 100%",
          }}
        />
        <FaMapMarkerAlt className={cn("relative z-10 text-white drop-shadow-md", config.icon)} />
      </div>

      {/* Logotipo - Text */}
      <div className={cn(config.textSize, "font-mulish leading-none text-blue-gray dark:text-white")}>
        <div className="font-light tracking-[0.08em] leading-none">La Guía</div>
        <div className="font-black leading-none">
          de <span className="text-pink">Chile</span>
        </div>
      </div>
    </div>
  );
}
