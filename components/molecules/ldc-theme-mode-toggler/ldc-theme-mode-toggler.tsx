"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { FaSun, FaMoon } from "react-icons/fa"

import { LDCSwitch } from "@/components/atoms/ldc-switch"

/**
 * LDCThemeModeToggler Component
 *
 * A theme mode toggle component that switches between light and dark modes.
 * Combines the custom LDCSwitch with theme-appropriate icons.
 *
 * @remarks
 * Layout: [Switch] [Icon]
 * - Switch on left, icon on right
 * - Light mode (unchecked): Shows Sun icon
 * - Dark mode (checked): Shows Moon icon
 * - Smooth transitions between states
 *
 * This is a Client Component because it uses the useTheme hook from next-themes.
 *
 * @example
 * ```tsx
 * // In your header or navigation
 * <LDCThemeModeToggler />
 * ```
 */
export interface LDCThemeModeTogglerProps {
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string
}

export function LDCThemeModeToggler({ className }: LDCThemeModeTogglerProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <LDCSwitch disabled />
          <div className="w-5 h-5" />
        </div>
      </div>
    )
  }

  const isDarkMode = theme === "dark"

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <LDCSwitch
          checked={isDarkMode}
          onCheckedChange={handleToggle}
          aria-label="Toggle theme mode"
        />
        <div className="w-5 h-5 flex items-center justify-center transition-all duration-300">
          {isDarkMode ? (
            <FaMoon
              className="text-yellow transition-transform duration-300 scale-100"
              aria-hidden="true"
            />
          ) : (
            <FaSun
              className="text-orange transition-transform duration-300 scale-100"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  )
}
