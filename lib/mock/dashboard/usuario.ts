/**
 * Datos simulados del rol Usuario. Los avisos y favoritos copian registros reales de la API
 * local (leídos el 2026-10-27); el dueño y la lista de favoritos son inventados.
 */
import type { IClassified } from "@/interfaces/classified";
import type { IDashboardFavorite } from "@/interfaces/dashboard";
import type { IMockOwned } from "./types";

const SELLER = {
  name: "María Martínez",
  email: "iphone13promax256gb@correo.cl",
  whatsapp: "+56 9 5010 4729",
};
const SANTIAGO = { id: "mock-city-santiago", name: "Santiago", slug: "santiago" };

export const MOCK_USUARIO_CLASSIFIEDS: IMockOwned<IClassified>[] = [
  {
    item: {
      id: "mock-classified-1",
      title: "iPhone 13 Pro Max 256GB - Excelente estado",
      slug: "iphone-13-pro-max-256gb",
      description: "",
      type: "vendo",
      category: { id: "mock-cat-tecnologia", name: "Tecnología", slug: "tecnologia", icon: "MdDevices" },
      city: SANTIAGO,
      commune: "Providencia",
      image: "https://picsum.photos/seed/classified1/400/400",
      price: { type: "fixed", amount: 650000 },
      featured: false,
      createdAt: "2024-12-25T10:00:00.000Z",
      expiresAt: "2025-01-24T10:00:00.000Z",
      seller: SELLER,
      gallery: [],
    },
    ownership: { status: "expired", visits30d: 0 },
  },
  {
    item: {
      id: "mock-classified-21",
      title: "Administrador de empresas busca empleo",
      slug: "administrador-empresas-busca-empleo",
      description: "",
      type: "busco",
      category: { id: "mock-cat-empleo", name: "Empleo", slug: "empleo", icon: "MdWork" },
      city: SANTIAGO,
      image: "https://picsum.photos/seed/classified21/400/400",
      price: { type: "negotiable" },
      featured: false,
      createdAt: "2024-12-19T16:00:00.000Z",
      expiresAt: "2025-01-18T16:00:00.000Z",
      seller: SELLER,
      gallery: [],
    },
    ownership: { status: "expired", visits30d: 0 },
  },
];

export const MOCK_USUARIO_FAVORITES: IDashboardFavorite[] = [
  {
    id: "fav-1",
    kind: "Comercio",
    title: "DJ Eventos Party Mix",
    place: "Santiago",
    image: "https://picsum.photos/seed/listing78/800/600",
    href: "/servicio/dj-eventos-party-mix",
  },
  {
    id: "fav-2",
    kind: "Servicio",
    title: "Instituto Idiomas Global",
    place: "Santiago",
    image: "https://picsum.photos/seed/listing68/800/600",
    href: "/servicio/instituto-idiomas-global",
  },
  {
    id: "fav-3",
    kind: "Propiedad",
    title: "Departamento con vista al mar",
    place: "Viña del Mar",
    image: "https://picsum.photos/seed/prop15/800/600",
    href: "/propiedad/departamento-vista-mar-vina-del-mar",
  },
  {
    id: "fav-4",
    kind: "Propiedad",
    title: "Casa mediterránea con piscina temperada",
    place: "Santiago",
    image: "https://picsum.photos/seed/prop20/800/600",
    href: "/propiedad/casa-mediterranea-piscina-temperada-lo-barnechea",
  },
  {
    id: "fav-5",
    kind: "Comercio",
    title: "Academia de Baile Ritmo Latino",
    place: "Valparaíso",
    image: "https://picsum.photos/seed/listing65/800/600",
    href: "/servicio/academia-baile-ritmo-latino",
  },
  {
    id: "fav-6",
    kind: "Noticia",
    title: "Inauguran nuevo centro cultural en Valparaíso con exposición de artistas locales",
    place: "Cultura",
    image: "https://picsum.photos/seed/news2/800/600",
    href: "/noticia/inauguran-nuevo-centro-cultural-valparaiso",
  },
];
