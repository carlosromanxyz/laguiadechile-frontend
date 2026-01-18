"use client";

import { LDCLogo } from "@/components/atoms/ldc-logo";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

export default function EnConstruccionPage() {
  return (
    <motion.div
      className="text-center space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <div className="flex justify-center">
        <LDCLogo isotipoSize="md" />
      </div>

      {/* Título */}
      <h1 className="text-xl md:text-2xl text-white leading-tight font-mulish">
        <span className="font-normal">Estamos construyendo </span>
        <span className="inline-block font-semibold bg-clip-text text-transparent animate-color-slide-text bg-[length:500%_100%] bg-[linear-gradient(90deg,var(--color-pink)_0%,var(--color-pink)_20%,var(--color-purple)_20%,var(--color-purple)_40%,var(--color-yellow)_40%,var(--color-yellow)_60%,var(--color-orange)_60%,var(--color-orange)_80%,var(--color-pink)_80%,var(--color-pink)_100%)]">
          algo increíble
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-sm text-neutral-500">
        Mientras tanto, puedes seguirnos en nuestras redes sociales para estar
        al tanto de las novedades.
      </p>

      {/* Redes sociales */}
      <nav className="flex items-center justify-center gap-4">
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
      </nav>
    </motion.div>
  );
}
