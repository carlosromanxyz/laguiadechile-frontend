"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LDCPropertyImageCarouselProps {
  /** Array of image URLs */
  images: string[];
  /** Alt text base for images */
  alt: string;
  /** Aspect ratio class (default: aspect-[4/3]) */
  aspectRatio?: string;
  /** Optional className for custom styling */
  className?: string;
  /** Children to overlay on images (badges, etc.) */
  children?: React.ReactNode;
  /** Show dot indicators (default: true) */
  showDots?: boolean;
  /** Show image counter (default: true) */
  showCounter?: boolean;
}

/**
 * LDCPropertyImageCarousel - Image Carousel for Property Cards
 *
 * Displays multiple property images in a swipeable carousel.
 * Features navigation arrows (on hover) and dot indicators.
 *
 * @example
 * ```tsx
 * <LDCPropertyImageCarousel
 *   images={["/img1.jpg", "/img2.jpg", "/img3.jpg"]}
 *   alt="Departamento en Las Condes"
 * >
 *   <Badge>VENTA</Badge>
 * </LDCPropertyImageCarousel>
 * ```
 */
export function LDCPropertyImageCarousel({
  images,
  alt,
  aspectRatio = "aspect-[4/3]",
  className,
  children,
  showDots = true,
  showCounter = true,
}: LDCPropertyImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      api?.scrollPrev();
    },
    [api]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      api?.scrollNext();
    },
    [api]
  );

  const scrollTo = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      api?.scrollTo(index);
    },
    [api]
  );

  // If only one image, render without carousel
  if (images.length <= 1) {
    return (
      <div className={cn("relative overflow-hidden", aspectRatio, className)}>
        <Image
          src={images[0] || "/images/placeholder-property.jpg"}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          quality={85}
        />
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative group/carousel", className)}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {images.map((image, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className={cn("relative overflow-hidden", aspectRatio)}>
                <Image
                  src={image}
                  alt={`${alt} - Imagen ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={85}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - visible on hover */}
        <button
          onClick={scrollPrev}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-20",
            "w-8 h-8 rounded-full bg-black/50 hover:bg-black/70",
            "flex items-center justify-center",
            "text-white transition-all duration-200",
            "opacity-0 group-hover/carousel:opacity-100",
            "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
          )}
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={scrollNext}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20",
            "w-8 h-8 rounded-full bg-black/50 hover:bg-black/70",
            "flex items-center justify-center",
            "text-white transition-all duration-200",
            "opacity-0 group-hover/carousel:opacity-100",
            "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
          )}
          aria-label="Siguiente imagen"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </Carousel>

      {/* Dot Indicators */}
      {showDots && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={(e) => scrollTo(index, e)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/50",
                index === current
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Ir a imagen ${index + 1}`}
              aria-current={index === current ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {showCounter && (
        <div className="absolute top-3 right-3 z-20 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm">
          {current + 1} / {count}
        </div>
      )}

      {/* Children overlay (badges, etc.) */}
      {children}
    </div>
  );
}
