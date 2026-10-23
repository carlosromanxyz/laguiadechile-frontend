import { cn } from "@/lib/utils";
import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import type { INews } from "@/interfaces/news";

interface LDCNewsAuthorProps {
  author: INews["author"];
  /** ISO date string of publication */
  createdAt: string;
  /** Reading time in minutes */
  readingTime: number;
  className?: string;
}

/**
 * LDCNewsAuthor - Author Card for News Article Detail Pages
 *
 * Sidebar card showing the author (avatar + name), publication date and
 * estimated reading time.
 */
export function LDCNewsAuthor({
  author,
  createdAt,
  readingTime,
  className,
}: LDCNewsAuthorProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("bg-card rounded-xl border border-border p-5", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Escrito por
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <p className="text-base font-bold font-mulish text-foreground">
          {author.name}
        </p>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-pink" />
          {formattedDate}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-pink" />
          {readingTime} min de lectura
        </p>
      </div>
    </div>
  );
}
