"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to detect if the viewport is mobile size
 * @param breakpoint - The max width to consider as mobile (default: 768px for md breakpoint)
 * @returns boolean indicating if the current viewport is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  // Start with undefined to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  // Return false during SSR/initial render to show desktop version by default
  return isMobile ?? false;
}
