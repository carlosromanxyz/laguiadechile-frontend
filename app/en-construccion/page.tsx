"use client";

import { LDCLogo } from "@/components/atoms/ldc-logo";
import { LDCCardWithIconAndTooltip } from "@/components/molecules/ldc-card-with-icon-and-tooltip";
import { motion, useReducedMotion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaStar, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.145_0_0)] via-[oklch(0.17_0.05_290)] to-[oklch(0.145_0_0)]">
      {/* Animated gradient orbs in background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orange orb */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 55) 0%, transparent 70%)",
            top: "10%",
            left: "10%",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.2, 1],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />

        {/* Pink orb */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.62 0.28 350) 0%, transparent 70%)",
            bottom: "10%",
            right: "10%",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, -80, 0],
                  y: [0, -60, 0],
                  scale: [1, 1.3, 1],
                }
          }
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />

        {/* Purple orb */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.58 0.24 290) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.4, 1],
                  rotate: [0, 90, 0],
                }
          }
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Triangle */}
        <motion.div
          className="absolute w-24 h-24 border-2 border-orange/20"
          style={{
            top: "20%",
            right: "15%",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -30, 0],
                  rotate: [0, 10, 0],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />

        {/* Circle */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-pink/20"
          style={{
            bottom: "30%",
            left: "20%",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 25, 0],
                  x: [0, 15, 0],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />

        {/* Square */}
        <motion.div
          className="absolute w-20 h-20 border-2 border-purple/20"
          style={{
            top: "60%",
            right: "25%",
            transform: "rotate(45deg)",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -20, 0],
                  rotate: [45, 55, 45],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
      </div>

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
            <LDCLogo />
          </motion.div>

          {/* Main heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight font-mulish">
              Estamos construyendo
              <br />
              <motion.span
                className="inline-block"
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
            <p className="text-lg md:text-xl text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Nuestro nuevo sitio estará listo pronto. Estamos trabajando para
              ofrecerte la mejor experiencia.
            </p>
          </motion.div>

          {/* Features preview */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
          >
            <motion.div
              whileHover={prefersReducedMotion ? {} : { y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <LDCCardWithIconAndTooltip
                icon={FaSearch}
                title="Búsqueda inteligente"
                description="Encuentra negocios fácilmente"
                tooltip="Sistema de búsqueda avanzada con filtros"
              />
            </motion.div>

            <motion.div
              whileHover={prefersReducedMotion ? {} : { y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <LDCCardWithIconAndTooltip
                icon={FaMapMarkerAlt}
                title="Geolocalización"
                description="Descubre lugares cercanos"
                tooltip="Encuentra negocios cerca de ti"
              />
            </motion.div>

            <motion.div
              whileHover={prefersReducedMotion ? {} : { y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <LDCCardWithIconAndTooltip
                icon={FaStar}
                title="Reseñas verificadas"
                description="Opiniones de la comunidad"
                tooltip="Calificaciones y reseñas auténticas"
              />
            </motion.div>
          </motion.div>

          {/* Footer text */}
          <motion.div variants={itemVariants} className="space-y-4">
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Mientras tanto, puedes seguirnos en nuestras redes sociales para estar
              al tanto de las novedades.
            </p>

            {/* Social media links */}
            <div className="flex items-center justify-center gap-4 text-sm">
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
                <FaTwitter className="w-5 h-5" />
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
