"use client";

import { cn } from "@/lib/utils";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface LDCLogoProps {
  className?: string;
}

export function LDCLogo({ className }: LDCLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Isotipo - Map Pin Icon with Lava Lamp Effect */}
      <div className="relative w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {/* Pink background */}
        <div className="absolute inset-0 bg-pink" />

        {/* Orange blob 1 - Moving diagonally */}
        <motion.div
          className="absolute w-20 h-20 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 55) 0%, transparent 70%)",
            filter: "blur(15px)",
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
          className="absolute w-24 h-24 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 55 / 0.8) 0%, transparent 70%)",
            filter: "blur(20px)",
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
          className="absolute w-16 h-16 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 55 / 0.6) 0%, transparent 70%)",
            filter: "blur(12px)",
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
        <FaMapMarkerAlt className="relative z-10 text-white w-10 h-10 drop-shadow-lg" />
      </div>

      {/* Logotipo - Text */}
      <div className="text-2xl font-mulish leading-tight text-white">
        <div className="font-light tracking-[0.08em]">La Guía</div>
        <div className="font-black">
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
