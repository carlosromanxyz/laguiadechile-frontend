/**
 * Datos simulados del rol Comercio. Las fichas copian registros reales de la API local
 * (leídos el 2026-10-27); estado, visitas, métricas, completitud y tareas son inventados.
 */
import type {
  IDashboardComercioStats,
  IDashboardCompletionItem,
  IDashboardTask,
} from "@/interfaces/dashboard";
import type { IListingDetail } from "@/interfaces/listing";
import type { IMockOwned } from "./types";

const SALUD = { id: "mock-cat-salud", name: "Salud y Bienestar", slug: "salud-y-bienestar", icon: "MdHealthAndSafety" };

export const MOCK_COMERCIO_LISTINGS: IMockOwned<IListingDetail>[] = [
  {
    item: {
      id: "mock-listing-72",
      title: "Centro Veterinario Mascotas Felices",
      slug: "centro-veterinario-mascotas-felices",
      type: "servicio",
      category: SALUD,
      city: { id: "mock-city-santiago", name: "Santiago", slug: "santiago" },
      image: "https://picsum.photos/seed/listing72/800/600",
      featured: true,
      createdAt: "2026-05-29T01:02:26.000Z",
      updatedAt: "2026-06-01T22:16:38.000Z",
      description: "",
      address: "Av. Providencia 2764",
      commune: "Ñuñoa",
      contact: {
        phone: "+56 2 2257 0168",
        email: "contacto@centroveterinariomascotasfelices.cl",
        website: "https://www.centroveterinariomascotasfelices.cl",
        whatsapp: "+56 9 5754 0488",
      },
      socialMedia: {},
      schedule: {
        monday: "09:00 - 20:00",
        tuesday: "09:00 - 20:00",
        wednesday: "09:00 - 20:00",
        thursday: "09:00 - 20:00",
        friday: "09:00 - 20:00",
        saturday: "10:00 - 14:00",
        sunday: "Cerrado",
      },
      gallery: [
        "https://picsum.photos/seed/listing72-1/800/600",
        "https://picsum.photos/seed/listing72-2/800/600",
        "https://picsum.photos/seed/listing72-3/800/600",
      ],
    },
    ownership: { status: "published", visits30d: 1284 },
  },
  {
    item: {
      id: "mock-listing-34",
      title: "Clínica Veterinaria Pet Care",
      slug: "clinica-veterinaria-pet-care",
      type: "servicio",
      category: SALUD,
      city: { id: "mock-city-valparaiso", name: "Valparaíso", slug: "valparaiso" },
      image: "https://picsum.photos/seed/listing34/800/600",
      featured: false,
      createdAt: "2026-05-29T01:02:26.000Z",
      updatedAt: "2026-06-01T22:16:38.000Z",
      description: "",
      address: "Calle Esmeralda 1358",
      commune: "Cerro Alegre",
      contact: {
        phone: "+56 2 2226 9246",
        email: "contacto@clinicaveterinariapetcare.cl",
        website: "https://www.clinicaveterinariapetcare.cl",
        whatsapp: "+56 9 5356 0786",
      },
      socialMedia: {},
      schedule: {
        monday: "09:00 - 20:00",
        tuesday: "09:00 - 20:00",
        wednesday: "09:00 - 20:00",
        thursday: "09:00 - 20:00",
        friday: "09:00 - 20:00",
        saturday: "10:00 - 14:00",
        sunday: "Cerrado",
      },
      gallery: [
        "https://picsum.photos/seed/listing34-1/800/600",
        "https://picsum.photos/seed/listing34-2/800/600",
        "https://picsum.photos/seed/listing34-3/800/600",
      ],
    },
    ownership: { status: "review", visits30d: 0 },
  },
];

export const MOCK_COMERCIO_STATS: IDashboardComercioStats = {
  visits: 1284,
  visitsDelta: 12,
  whatsapp: 86,
  calls: 41,
  web: 57,
};

/** Visitas de los últimos 14 días, del más antiguo a hoy. */
export const MOCK_COMERCIO_VISITS_14D: number[] = [
  61, 74, 58, 92, 103, 88, 47, 66, 81, 95, 110, 99, 72, 54,
];

export const MOCK_COMERCIO_COMPLETION: { pct: number; items: IDashboardCompletionItem[] } = {
  pct: 80,
  items: [
    { label: "Descripción", done: true },
    { label: "Horario semanal", done: true },
    { label: "Teléfono y WhatsApp", done: true },
    { label: "Redes sociales", done: true },
    { label: "Galería (3 de 5 fotos)", done: false },
    { label: "Horario de feriados", done: false },
  ],
};

export const MOCK_COMERCIO_TASKS: IDashboardTask[] = [
  {
    id: "para-hoy",
    tone: "info",
    title: "Para hoy",
    description:
      "Define tu horario para el feriado del 8 de diciembre · «Clínica Veterinaria Pet Care» está en revisión.",
    action: { label: "Ir", href: "/dashboard/comercio/horario-y-contacto" },
  },
];
