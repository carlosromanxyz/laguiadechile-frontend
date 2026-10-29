import "server-only";
/**
 * Datos del panel del rol Comercio, desde la API con la sesión del request (`apiFetchServer`):
 * sus fichas (`GET /me/listings`) y sus métricas (`GET /me/metrics`). La completitud, las tareas
 * y el resumen de contacto se derivan en el front de la ficha principal.
 *
 * Ante un error de la API, listas vacías y métricas en cero: el layout del panel también pide
 * el contador del menú y no debe caerse por eso.
 */
import { cache } from "react";
import type {
  IDashboardComercioStats,
  IDashboardCompletionItem,
  IDashboardContactSummary,
  IDashboardOwned,
  IDashboardTask,
  IDashboardVisitPoint,
} from "@/interfaces/dashboard";
import type { IListingDetail } from "@/interfaces/listing";
import { apiFetchServer } from "@/lib/api-client";
import { mapListing, type RawListing } from "@/lib/api/mappers";
import { getTodayInSantiago, santiagoDayToIso } from "@/lib/dashboard/dates";
import { toPublicationStatus } from "@/lib/dashboard/status";

type RawMyListing = RawListing & { status: string };

interface RawMetricCounts {
  views: number;
  whatsapp: number;
  calls: number;
  web: number;
}

interface RawMeMetrics {
  days: number;
  from: string;
  to: string;
  listingId: string | null;
  series: (RawMetricCounts & { date: string })[];
  totals: RawMetricCounts;
  deltaViews: number | null;
}

type MetricWindow = 14 | 30;

/** Fotos de la galería que pide la completitud. */
const GALLERY_TARGET = 5;
const FICHA_HREF = "/dashboard/comercio/ficha";

const fetchMyListings = cache(async (): Promise<RawMyListing[]> => {
  try {
    const data = await apiFetchServer<unknown>("/me/listings");
    return Array.isArray(data) ? (data as RawMyListing[]) : [];
  } catch {
    return [];
  }
});

const fetchMyMetrics = cache(
  async (days: MetricWindow, listingId?: string): Promise<RawMeMetrics | null> => {
    const qs = new URLSearchParams({ days: String(days) });
    if (listingId) qs.set("listingId", listingId);
    try {
      return await apiFetchServer<RawMeMetrics>(`/me/metrics?${qs}`);
    } catch {
      return null;
    }
  },
);

/** Ficha principal: la primera publicada; si no hay, la editada más reciente. */
async function getMainListing(): Promise<RawMyListing | null> {
  const raw = await fetchMyListings();
  return raw.find((l) => l.status === "PUBLISHED") ?? raw[0] ?? null;
}

/** Fichas del comercio con su estado y sus visitas de 30 días. */
export async function getMyListings(): Promise<IDashboardOwned<IListingDetail>[]> {
  const raw = await fetchMyListings();
  const metrics = await Promise.all(raw.map((l) => fetchMyMetrics(30, l.id)));
  return raw.map((l, i) => ({
    item: mapListing(l),
    ownership: {
      status: toPublicationStatus(l.status),
      visits30d: metrics[i]?.totals.views ?? null,
    },
  }));
}

/** Visitas y clics de los últimos 30 días, de todas sus fichas. */
export async function getMyStats(): Promise<IDashboardComercioStats> {
  const m = await fetchMyMetrics(30);
  return {
    visits: m?.totals.views ?? 0,
    visitsDelta: m ? m.deltaViews : 0,
    whatsapp: m?.totals.whatsapp ?? 0,
    calls: m?.totals.calls ?? 0,
    web: m?.totals.web ?? 0,
  };
}

/** Visitas por día de los últimos 14 días, terminando hoy (vacío si no hay métricas). */
export async function getMyVisitsSeries(): Promise<IDashboardVisitPoint[]> {
  const m = await fetchMyMetrics(14);
  return (m?.series ?? []).map((p) => ({ date: santiagoDayToIso(p.date), value: p.views }));
}

function hasText(v: string | null | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function hasAnyValue(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  return Object.values(v as Record<string, unknown>).some((x) =>
    typeof x === "string" ? x.trim().length > 0 : x != null && typeof x === "object",
  );
}

/** Completitud de la ficha principal: campos vacíos y fotos de la galería. */
export async function getMyProfileCompletion(): Promise<{
  pct: number;
  items: IDashboardCompletionItem[];
} | null> {
  const l = await getMainListing();
  if (!l) return null;
  const photos = l.gallery?.length ?? 0;
  const items: IDashboardCompletionItem[] = [
    { label: "Descripción", done: hasText(l.description) },
    { label: "Horario semanal", done: hasAnyValue(l.schedule) },
    { label: "Teléfono y WhatsApp", done: hasText(l.phone) && hasText(l.whatsapp) },
    { label: "Dirección", done: hasText(l.address) },
    { label: "Redes sociales", done: hasAnyValue(l.socialMedia) },
    {
      label: `Galería (${Math.min(photos, GALLERY_TARGET)} de ${GALLERY_TARGET} fotos)`,
      done: photos >= GALLERY_TARGET,
    },
  ];
  const pct = Math.round((items.filter((i) => i.done).length / items.length) * 100);
  // Lo hecho arriba y lo que falta al final: el componente destaca esto último en negrita.
  return { pct, items: [...items.filter((i) => i.done), ...items.filter((i) => !i.done)] };
}

/** Tareas del inicio: fichas rechazadas, fichas en revisión y lo que falta en la principal. */
export async function getMyTasks(): Promise<IDashboardTask[]> {
  const [raw, completion] = await Promise.all([fetchMyListings(), getMyProfileCompletion()]);
  const tasks: IDashboardTask[] = [];

  for (const l of raw.filter((x) => x.status === "REJECTED")) {
    tasks.push({
      id: `rechazada-${l.id}`,
      tone: "warning",
      title: `«${l.title}» no fue aprobada`,
      description: "Revisa los datos de la ficha y vuelve a enviarla a revisión.",
      action: { label: "Editar", href: FICHA_HREF },
    });
  }

  const inReview = raw.filter((x) => x.status === "REVIEW");
  if (inReview.length > 0) {
    tasks.push({
      id: "en-revision",
      tone: "info",
      title: inReview.length === 1 ? "Una ficha en revisión" : `${inReview.length} fichas en revisión`,
      description: `${inReview.map((l) => `«${l.title}»`).join(", ")}: ${
        inReview.length === 1 ? "la publicaremos" : "las publicaremos"
      } cuando el equipo ${inReview.length === 1 ? "la apruebe" : "las apruebe"}.`,
    });
  }

  const missing = completion?.items.filter((i) => !i.done) ?? [];
  if (missing.length > 0) {
    tasks.push({
      id: "completar-ficha",
      tone: "info",
      title: "Completa tu ficha",
      description: `Falta: ${missing.map((i) => i.label.toLowerCase()).join(", ")}.`,
      action: { label: "Completar", href: FICHA_HREF },
    });
  }

  return tasks;
}

/** Horario de hoy y contactos de la ficha principal (`null` si no tiene fichas). */
export async function getMyContactSummary(): Promise<IDashboardContactSummary | null> {
  const raw = await getMainListing();
  if (!raw) return null;
  const main = mapListing(raw);
  const today = getTodayInSantiago();
  return {
    todayLabel: `Hoy, ${today.name}`,
    todayHours: main.schedule?.[today.key] ?? "Sin horario",
    phone: main.contact.phone,
    whatsapp: main.contact.whatsapp,
    website: main.contact.website,
    address: [main.address, main.commune].filter(Boolean).join(", ") || undefined,
  };
}

/** Publicaciones en revisión: contador del menú «Mis publicaciones». */
export async function getMyInReviewCount(): Promise<number> {
  return (await fetchMyListings()).filter((l) => l.status === "REVIEW").length;
}
