"use client";

import { cn } from "@/lib/utils";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface LDCLogoProps {
  className?: string;
  isotipoSize?: "sm" | "md" | "lg";
}

export function LDCLogo({ className, isotipoSize = "lg" }: LDCLogoProps) {
  // Size configurations for isotipo
  const sizeConfig = {
    sm: {
      container: "w-12 h-12",
      icon: "w-7 h-7",
      blob1: "w-15 h-15", // 60px (proportional to 20 from original 64px base)
      blob2: "w-18 h-18", // 72px (proportional to 24)
      blob3: "w-12 h-12", // 48px (proportional to 16)
      blur1: "blur-[11px]", // proportional to 15px
      blur2: "blur-[15px]", // proportional to 20px
      blur3: "blur-[9px]",  // proportional to 12px
    },
    md: {
      container: "w-14 h-14",
      icon: "w-8 h-8",
      blob1: "w-[70px] h-[70px]", // proportional scaling
      blob2: "w-[84px] h-[84px]",
      blob3: "w-14 h-14",
      blur1: "blur-[13px]",
      blur2: "blur-[17px]",
      blur3: "blur-[10px]",
    },
    lg: {
      container: "w-16 h-16",
      icon: "w-10 h-10",
      blob1: "w-20 h-20",
      blob2: "w-24 h-24",
      blob3: "w-16 h-16",
      blur1: "blur-[15px]",
      blur2: "blur-[20px]",
      blur3: "blur-[12px]",
    },
  };

  const config = sizeConfig[isotipoSize];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Isotipo - Map Pin Icon with Lava Lamp Effect */}
      <div className={cn("relative rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden", config.container)}>
        {/* Pink background */}
        <div className="absolute inset-0 bg-pink" />

        {/* Orange blob 1 - Moving diagonally */}
        <motion.div
          className={cn("absolute rounded-full", config.blob1, config.blur1)}
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 55) 0%, transparent 70%)",
          }}
          animate={{
            x: ["-20%", "30%", "-20%"],
            y: ["-20%", "40%", "-20%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orange blob 2 - Moving opposite direction */}
        <motion.div
          className={cn("absolute rounded-full", config.blob2, config.blur2)}
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 55 / 0.8) 0%, transparent 70%)",
          }}
          animate={{
            x: ["50%", "-10%", "50%"],
            y: ["50%", "-10%", "50%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orange blob 3 - Slow movement */}
        <motion.div
          className={cn("absolute rounded-full", config.blob3, config.blur3)}
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 55 / 0.6) 0%, transparent 70%)",
          }}
          animate={{
            x: ["20%", "-20%", "20%"],
            y: ["-10%", "30%", "-10%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pin icon */}
        <FaMapMarkerAlt className={cn("relative z-10 text-white drop-shadow-lg", config.icon)} />
      </div>

      {/* Logotipo - Text */}
      <div className="text-2xl font-mulish leading-none text-white">
        <div className="font-light tracking-[0.08em] leading-none">La Guía</div>
        <div className="font-black leading-none">
          de{" "}
          <span className="relative inline-block text-pink">
            Chile
            <motion.span
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, transparent 42%, oklch(0.75 0.18 55) 50%, transparent 58%, transparent 100%)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mixBlendMode: "lighten",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "-200% 0%"],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2,
              }}
            >
              Chile
            </motion.span>
          </span>
        </div>
      </div>
    </div>
  );
}
