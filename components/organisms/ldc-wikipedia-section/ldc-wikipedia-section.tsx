"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink } from "lucide-react";

interface WikipediaData {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  url: string;
  description?: string;
}

interface LDCWikipediaSectionProps {
  /** City name to fetch Wikipedia data for */
  cityName: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCWikipediaSection - Wikipedia City Information
 *
 * Displays city information from Spanish Wikipedia including
 * description, image, and link to full article.
 *
 * @example
 * ```tsx
 * <LDCWikipediaSection cityName="Santiago" />
 * ```
 */
export function LDCWikipediaSection({
  cityName,
  className,
}: LDCWikipediaSectionProps) {
  const [data, setData] = useState<WikipediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWikipediaData() {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(
          `/api/wikipedia?city=${encodeURIComponent(cityName)}`
        );
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    }

    fetchWikipediaData();
  }, [cityName]);

  // Don't render anything if error or no data
  if (error || (!loading && !data)) {
    return null;
  }

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
