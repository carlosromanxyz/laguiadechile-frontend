"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Theme Provider Component
 *
 * Client-side wrapper for next-themes provider.
 * This component enables theme switching throughout the application.
 *
 * @remarks
 * This is a Client Component because next-themes requires client-side hooks.
 * The provider is separated from the layout to maintain server components elsewhere.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
