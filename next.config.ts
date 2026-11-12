import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    // Sin hosts remotos (CLGDC-84): toda imagen vive en el bucket y se sirve por `/media/...`.
  },
  // Anti-clickjacking: nadie fuera del propio sitio puede embeberlo en un iframe.
  // Solo `frame-ancestors`, sin más directivas de CSP, para no bloquear recursos.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  // La ruta legal pasó a singular (CLGDC-225); la antigua en plural responde 308 hacia la nueva.
  async redirects() {
    return [
      { source: "/politicas-de-privacidad", destination: "/politica-de-privacidad", permanent: true },
    ];
  },
};

export default nextConfig;
