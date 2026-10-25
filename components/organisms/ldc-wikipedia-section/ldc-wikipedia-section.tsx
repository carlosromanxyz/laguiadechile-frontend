import Image from "next/image";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink } from "lucide-react";
import type { IWikipediaCityInfo } from "@/interfaces/wikipedia";

interface LDCWikipediaSectionProps {
  /** City name shown in the heading («Acerca de <ciudad>») */
  cityName: string;
  /** Resumen de Wikipedia; `null` no pinta nada (salvo mientras `loading`) */
  data: IWikipediaCityInfo | null;
  /** Muestra el esqueleto de carga */
  loading?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCWikipediaSection - Wikipedia City Information
 *
 * Presentacional: muestra la descripción, la imagen y el enlace al artículo de la Wikipedia en
 * español que recibe, o un esqueleto mientras `loading`. Los datos los pide `useCityWikipedia`.
 *
 * @example
 * ```tsx
 * const { data, loading } = useCityWikipedia("Santiago");
 * <LDCWikipediaSection cityName="Santiago" data={data} loading={loading} />
 * ```
 */
export function LDCWikipediaSection({
  cityName,
  data,
  loading = false,
  className,
}: LDCWikipediaSectionProps) {
  // Loading skeleton
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card overflow-hidden animate-pulse",
          className
        )}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image skeleton */}
          <div className="w-full md:w-72 h-48 md:h-auto bg-muted" />

          {/* Content skeleton */}
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted" />
              <div className="h-7 w-48 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        {data.thumbnail && (
          <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0">
            <Image
              src={data.thumbnail.source}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 288px"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-gray/10 dark:bg-blue-gray/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-gray" />
            </div>
            <h2 className="text-2xl font-bold font-mulish text-foreground">
              Acerca de {cityName}
            </h2>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed line-clamp-5">
            {data.extract}
          </p>

          {/* Link to Wikipedia */}
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-pink dark:text-yellow hover:underline"
          >
            Leer más en Wikipedia
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
