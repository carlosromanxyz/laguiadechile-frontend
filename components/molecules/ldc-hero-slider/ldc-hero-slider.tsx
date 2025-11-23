"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

/**
 * LDCHeroSlider - Hero Background Image Slider Component
 *
 * Displays an automatic slideshow of images as the hero background.
 * Uses shadcn/ui Carousel component built on Embla Carousel.
 * Uses placeholder images from picsum.photos for development.
 *
 * Features:
 * - Automatic slideshow (3 second intervals)
 * - Smooth fade transitions with Embla Carousel Fade plugin
 * - 30% opacity overlay
 * - Absolute positioned behind content
 * - Placeholder images for development
 *
 * @example
 * <LDCHeroSlider />
 */

const SLIDE_IMAGES = [
  "https://picsum.photos/seed/hero1/1920/1080",
  "https://picsum.photos/seed/hero2/1920/1080",
  "https://picsum.photos/seed/hero3/1920/1080",
];

export function LDCHeroSlider() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Fade(),
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
        className="h-full w-full"
      >
        <CarouselContent className="ml-0 h-full">
          {SLIDE_IMAGES.map((image, index) => (
            <CarouselItem key={index} className="h-screen min-h-screen pl-0">
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
