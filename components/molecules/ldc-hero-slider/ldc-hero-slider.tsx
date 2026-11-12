"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CAROUSEL_LOOP_OPTIONS, createFadeAutoplayPlugins } from "@/lib/carousel/presets";

/**
 * LDCHeroSlider - Hero Background Image Slider Component
 *
 * Displays an automatic slideshow of images as the hero background.
 * Uses shadcn/ui Carousel component built on Embla Carousel.
 * Las fotos viven en el bucket MinIO `lgdc-media` y se sirven por `/media/demo/...`
 * (CLGDC-84: nada de enlaces externos para assets).
 *
 * Features:
 * - Automatic slideshow (3 second intervals)
 * - Smooth fade transitions with Embla Carousel Fade plugin
 * - 30% opacity overlay
 * - Absolute positioned behind content
 * - Fotos demo de Chile (Torres del Paine, Valparaíso, Santiago)
 *
 * @example
 * <LDCHeroSlider />
 */

const SLIDE_IMAGES = [
  { src: "/media/demo/hero-1-ddf5eccd.jpg", alt: "Torres del Paine, en la Patagonia chilena" },
  { src: "/media/demo/hero-2-2c21f8d2.jpg", alt: "Valparaíso visto desde el Cerro Florida" },
  { src: "/media/demo/hero-3-f4f1fac0.jpg", alt: "Santiago con la cordillera de los Andes al fondo" },
];

export function LDCHeroSlider() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
      <Carousel
        opts={CAROUSEL_LOOP_OPTIONS}
        plugins={createFadeAutoplayPlugins(3000)}
        className="h-full w-full"
      >
        <CarouselContent className="ml-0 h-full">
          {SLIDE_IMAGES.map((image, index) => (
            <CarouselItem key={index} className="h-screen min-h-screen pl-0">
              <div
                role="img"
                aria-label={image.alt}
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image.src})`,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
