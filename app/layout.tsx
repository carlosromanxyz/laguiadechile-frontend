import type { Metadata } from "next";
import { Mulish, Open_Sans } from "next/font/google";
import "./globals.css";
import { LDCHeader } from "@/components/organisms/ldc-header";
import { LDCFooter } from "@/components/organisms/ldc-footer";
import { ThemeProvider } from "@/components/shared/theme-provider";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Guía de Chile",
  description: "Descubre los mejores lugares, servicios y negocios de Chile",
  // Icons are automatically handled by app/icon.tsx and app/apple-icon.tsx
  // Next.js 16 convention-based metadata API will serve them at /icon and /apple-icon
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${mulish.variable} ${openSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LDCHeader />
          {children}
          <LDCFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
