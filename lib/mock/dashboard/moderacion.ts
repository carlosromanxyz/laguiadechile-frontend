/** Cola de moderación simulada del administrador (registros reales, envíos inventados). */
import type { IDashboardModerationItem } from "@/interfaces/dashboard";

export const MOCK_MODERATION_QUEUE: IDashboardModerationItem[] = [
  {
    id: "mod-1",
    kind: "new-listing",
    title: "Clínica Veterinaria Pet Care",
    by: "Mascotas Felices SpA (comercio)",
    city: "Valparaíso",
    when: "hace 2 h",
    image: "https://picsum.photos/seed/listing34/800/600",
    href: "/servicio/clinica-veterinaria-pet-care",
  },
  {
    id: "mod-2",
    kind: "renewal",
    title: "iPhone 13 Pro Max 256GB - Excelente estado",
    by: "María Martínez (usuario)",
    city: "Santiago",
    when: "hace 5 h",
    image: "https://picsum.photos/seed/classified1/400/400",
    href: "/aviso/iphone-13-pro-max-256gb",
  },
  {
    id: "mod-3",
    kind: "report",
    title: "Toyota Yaris 2019 - 45.000 km",
    by: "Reportado por 2 usuarios: «precio sospechoso»",
    city: "Santiago",
    when: "ayer",
    image: "https://picsum.photos/seed/classified8/400/400",
    href: "/aviso/toyota-yaris-2019",
  },
];
