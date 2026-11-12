import Link from "next/link";
import { FileText, ListOrdered, MessageCircleQuestion, Scale, ShieldCheck, type LucideIcon } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCListingsPageHero } from "@/components/organisms/ldc-listings-page-hero";
import type { IBreadcrumbItem } from "@/interfaces/breadcrumb";
import type { ILegalDocument } from "@/interfaces/legal";
import { cn } from "@/lib/utils";

/** Páginas legales del sitio: Términos primero (el footer, `config/navigation.ts`, pone Privacidad primero). */
const LEGAL_PAGES = [
  { href: "/terminos-y-condiciones", label: "Términos y condiciones", icon: FileText },
  { href: "/politica-de-privacidad", label: "Política de privacidad", icon: ShieldCheck },
] as const satisfies readonly { href: string; label: string; icon: LucideIcon }[];

export type LDCLegalPageHref = (typeof LEGAL_PAGES)[number]["href"];

export interface LDCLegalTemplateProps {
  /** Documento legal (texto plano de `content/legal/*`) */
  document: ILegalDocument;
  /** Ruta de la página actual: elige el ícono del hero y marca la página en «Otras páginas legales» */
  href: LDCLegalPageHref;
}

/** Foco opaco: anillo rosado intenso en claro y amarillo en oscuro, sobre el fondo de la card. */
const FOCUS_CLASS =
  "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-pink-strong focus-visible:ring-offset-2 focus-visible:ring-offset-card dark:focus-visible:ring-yellow";

/** Enlace de la sidebar: 44 px de alto, texto que envuelve y borde izquierdo de marca en la página actual. */
const SIDEBAR_LINK_CLASS = cn(
  "flex min-h-11 items-center gap-2 rounded-md border-l-2 border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors",
  "hover:bg-muted hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
  FOCUS_CLASS,
);

const SIDEBAR_TITLE_CLASS = "text-lg font-bold font-mulish text-foreground mb-3 flex items-center gap-2";

/** `YYYY-MM-DD` → «12 de noviembre de 2026» (en UTC para que el día no se corra). */
function formatUpdatedAt(updatedAt: string): string {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${updatedAt}T00:00:00Z`),
  );
}

/**
 * LDCLegalTemplate - Páginas legales (términos, privacidad) en dos columnas.
 *
 * Server Component sin datos. Usa la grilla de las fichas de detalle (`DetailLayout` de
 * `LDCDetailTemplate`): el documento en `lg:col-span-2` y la sidebar a la derecha, que desde `lg`
 * queda fija bajo el header (`--ldc-header-height`) con «En esta página» (anclas a cada `h2`),
 * «Otras páginas legales» (la actual con `aria-current="page"`) y «¿Dudas?» hacia `/contacto`.
 * En móvil todo va en una columna, con la sidebar después del texto.
 *
 * @example
 * ```tsx
 * <LDCLegalTemplate document={TERMS} href="/terminos-y-condiciones" />
 * ```
 */
export function LDCLegalTemplate({ document, href }: LDCLegalTemplateProps) {
  const current = LEGAL_PAGES.find((page) => page.href === href) ?? LEGAL_PAGES[0];
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: document.title, href: "" },
  ];

  return (
    <>
      <LDCListingsPageHero title={document.title} breadcrumbs={breadcrumbs} icon={current.icon} />

      <main>
        <LDCSection paddingY="md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 min-w-0">
              <LDCPanel as="article" padding="lg" className="space-y-8">
                <header className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Última actualización:{" "}
                    <time dateTime={document.updatedAt} className="font-semibold text-foreground">
                      {formatUpdatedAt(document.updatedAt)}
                    </time>
                  </p>
                  {document.intro && <p className="text-foreground leading-relaxed">{document.intro}</p>}
                </header>

                {document.sections.map((section) => (
                  <section key={section.id} aria-labelledby={section.id} className="space-y-3">
                    <h2 id={section.id} className="text-xl font-bold font-mulish text-foreground">
                      {section.title}
                    </h2>
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground leading-relaxed marker:text-pink-strong dark:marker:text-yellow">
                        {section.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </LDCPanel>
            </div>

            <aside
              aria-label="Navegación legal"
              className="space-y-6 min-w-0 lg:sticky lg:top-[calc(var(--ldc-header-height)+1.5rem)] lg:self-start lg:max-h-[calc(100svh-var(--ldc-header-height)-3rem)] lg:overflow-y-auto"
            >
              <LDCPanel as="section" aria-labelledby="legal-en-esta-pagina">
                <h2 id="legal-en-esta-pagina" className={SIDEBAR_TITLE_CLASS}>
                  <ListOrdered className="w-5 h-5 text-pink" aria-hidden />
                  En esta página
                </h2>
                <nav aria-labelledby="legal-en-esta-pagina">
                  <ul className="space-y-1">
                    {document.sections.map((section) => (
                      <li key={section.id}>
                        <a href={`#${section.id}`} className={SIDEBAR_LINK_CLASS}>
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </LDCPanel>

              <LDCPanel as="section" aria-labelledby="legal-otras-paginas">
                <h2 id="legal-otras-paginas" className={SIDEBAR_TITLE_CLASS}>
                  <Scale className="w-5 h-5 text-pink" aria-hidden />
                  Otras páginas legales
                </h2>
                <nav aria-labelledby="legal-otras-paginas">
                  <ul className="space-y-1">
                    {LEGAL_PAGES.map((page) => {
                      const Icon = page.icon;
                      const isCurrent = page.href === current.href;
                      return (
                        <li key={page.href}>
                          <Link
                            href={page.href}
                            aria-current={isCurrent ? "page" : undefined}
                            className={cn(
                              SIDEBAR_LINK_CLASS,
                              isCurrent &&
                                "border-pink-strong bg-muted font-bold text-foreground dark:border-yellow",
                            )}
                          >
                            <Icon aria-hidden />
                            {page.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </LDCPanel>

              <LDCPanel as="section" aria-labelledby="legal-dudas">
                <h2 id="legal-dudas" className={SIDEBAR_TITLE_CLASS}>
                  <MessageCircleQuestion className="w-5 h-5 text-pink" aria-hidden />
                  ¿Dudas?
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Si tienes preguntas sobre este texto, escríbenos y te responderemos.
                </p>
                <LDCCTAButton href="/contacto" text="Escríbenos" showIcon={false} />
              </LDCPanel>
            </aside>
          </div>
        </LDCSection>
      </main>
    </>
  );
}
