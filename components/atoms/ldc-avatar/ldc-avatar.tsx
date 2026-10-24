import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SIZE_PX = { sm: 24, md: 32, lg: 48 } as const;

/** Caja del avatar con imagen enmarcada (`w-*`/`h-*`, como la card de noticia). */
const frameSize = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-12 h-12" } as const;

/** Tamaño del `Avatar` de shadcn cuando solo hay iniciales. */
const fallbackSize = { sm: "size-6", md: "size-8", lg: "size-12" } as const;

export type LDCAvatarSize = keyof typeof SIZE_PX;

interface LDCAvatarProps {
  /** Nombre de la persona: `alt` de la imagen y fuente de las iniciales */
  name: string;
  /** URL de la foto; sin ella se muestran las iniciales */
  src?: string;
  /** sm 24 px · md 32 px · lg 48 px */
  size?: LDCAvatarSize;
  /**
   * Con foto: `true` (por defecto) la pone en una caja redonda con fondo `bg-muted`
   * e imagen `fill` (card de noticia); `false` pinta la `Image` sola con
   * ancho/alto fijos (panel de autor).
   */
  framed?: boolean;
  /** Optional className for custom styling (va al elemento raíz) */
  className?: string;
}

/** Hasta dos iniciales en mayúsculas («Ana María Pérez» → «AM»). */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * LDCAvatar - Avatar redondo con foto o iniciales
 *
 * Con foto usa `next/image` (optimizada y pintada desde el primer render); sin
 * foto envuelve el `Avatar`/`AvatarFallback` de shadcn con las iniciales. La foto
 * no pasa por `AvatarImage` porque Radix solo la monta tras cargarla, lo que
 * cambia el DOM y el primer pintado respecto de las cards actuales.
 *
 * @example
 * ```tsx
 * <LDCAvatar name={author.name} src={author.avatar} size="sm" />
 * <LDCAvatar name={author.name} src={author.avatar} size="lg" framed={false} />
 * <LDCAvatar name={user.name} />
 * ```
 */
export function LDCAvatar({ name, src, size = "md", framed = true, className }: LDCAvatarProps) {
  const px = SIZE_PX[size];

  if (!src) {
    return (
      <Avatar className={cn(fallbackSize[size], className)}>
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
    );
  }

  if (!framed) {
    return (
      <Image
        src={src}
        alt={name}
        width={px}
        height={px}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative",
        frameSize[size],
        "rounded-full overflow-hidden flex-shrink-0 bg-muted",
        className
      )}
    >
      <Image src={src} alt={name} fill sizes={`${px}px`} className="object-cover" />
    </div>
  );
}
