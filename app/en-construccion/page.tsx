"use client";

import { LDCLogo } from "@/components/atoms/ldc-logo";
import { motion, useReducedMotion } from "framer-motion";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

/**
 * Construction/Maintenance Page
 *
 * Modern, engaging under construction page with animations and visual effects.
 * Features animated gradient background, floating shapes, progress indicator,
 * and compelling messaging in Spanish.
 */
export default function EnConstruccionPage() {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const, // Custom easing for smooth animation
      },
    },
  };

  const floatingAnimation = prefersReducedMotion
    ? {}
    : {
        y: [0, -20, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const pulseAnimation = prefersReducedMotion
    ? {}
    : {
        scale: [1, 1.05, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-900">
      {/* Caution stripe */}
      <div className="absolute top-0 left-0 right-0 h-4 z-20"
        style={{
          background: "repeating-linear-gradient(45deg, #000 0px, #000 20px, #ffbe0b 20px, #ffbe0b 40px)"
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="w-full text-center space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          {/* Logo with floating animation */}
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
            animate={floatingAnimation}
          >
            <LDCLogo isotipoSize="sm" />
          </motion.div>

          {/* Main heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-3xl md:text-4xl text-white leading-tight font-mulish">
              <span className="font-normal">Estamos construyendo </span>
              <motion.span
                className="inline-block font-semibold"
                style={{
                  background: "linear-gradient(90deg, oklch(0.75 0.18 55) 0%, oklch(0.62 0.28 350) 33%, oklch(0.58 0.24 290) 66%, oklch(0.75 0.18 55) 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        backgroundPosition: ["0% 0%", "-200% 0%"],
                      }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear" as const,
                }}
              >
                algo increíble
              </motion.span>
            </h1>
          </motion.div>

          {/* Footer text */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 w-full">
            <p className="text-sm text-neutral-500 text-center md:text-left">
              Mientras tanto, puedes seguirnos en nuestras redes sociales para estar
              al tanto de las novedades.
            </p>

            {/* Social media links */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href="https://fb.com/laguiadechilecl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/laguiadechilecl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FaXTwitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com/laguiadechilecl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.145_0_0)] to-transparent pointer-events-none" />
    </div>
  );
}
