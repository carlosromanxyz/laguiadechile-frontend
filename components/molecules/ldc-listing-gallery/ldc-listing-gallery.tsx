"use client";

import { LDCPanel } from "@/components/atoms/ldc-panel";
import Image from "next/image";
import { Images } from "lucide-react";
import {
  CAROUSEL_LOOP_OPTIONS,
  createFadeAutoplayPlugins,
} from "@/lib/carousel/presets";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface LDCListingGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

/**
 * LDCListingGallery - Image Gallery Carousel Component
 *
 * Displays images in a carousel using shadcn's Carousel component.
 */
export function LDCListingGallery({
  images,
  title,
  className,
}: LDCListingGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <LDCPanel className={className}>
      <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
        <Images className="w-5 h-5 text-pink" />
        Galería
      </h3>

      <Carousel
        opts={CAROUSEL_LOOP_OPTIONS}
        plugins={createFadeAutoplayPlugins(4000)}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={image}
                  alt={`${title} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </LDCPanel>
  );
}
