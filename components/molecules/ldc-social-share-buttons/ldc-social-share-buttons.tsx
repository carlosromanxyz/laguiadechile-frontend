"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";

interface LDCSocialShareButtonsProps {
  /** Title to share */
  title: string;
  /** Optional className for custom styling */
  className?: string;
  /** Variant: 'light' for dark backgrounds, 'dark' for light backgrounds */
  variant?: "light" | "dark";
}

/**
 * LDCSocialShareButtons - Social Media Share Button
 *
 * Uses the native Web Share API to share the current page.
 * Falls back to clipboard copy if Web Share is not available.
 *
 * @example
 * ```tsx
 * <LDCSocialShareButtons title="Santiago" />
 * ```
 */
export function LDCSocialShareButtons({
  title,
  className,
  variant = "light",
}: LDCSocialShareButtonsProps) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const shareMessage = `Descubre ${title} en La Guía de Chile`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - La Guía de Chile`,
          text: shareMessage,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareMessage}\n${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  const isLight = variant === "light";

  const buttonClass = cn(
    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer",
    isLight
      ? "bg-white/20 border border-white/30 text-white hover:bg-white/30"
      : "bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20"
  );

  return (
    <div className={cn("flex items-center", className)}>
      <button
        onClick={handleShare}
        aria-label="Compartir"
        className={buttonClass}
      >
        <Share2 className="h-4 w-4" />
        <span className="text-sm font-medium">
          {copied ? "¡Copiado!" : "Compartir"}
        </span>
      </button>
    </div>
  );
}
