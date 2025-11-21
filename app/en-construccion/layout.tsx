import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "En Construcción | La Guía de Chile",
  description: "Sitio en construcción. Pronto estaremos de vuelta.",
};

export default function EnConstruccionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
