"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImageCarouselProps {
  images: string[]
  productName: string
}

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultipleImages = images.length > 1

  if (images.length === 0) {
    return <div className="relative aspect-square overflow-hidden rounded-lg bg-muted" />
  }

  const showPreviousImage = () => {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1))
  }

  const showNextImage = () => {
    setActiveIndex((index) => (index + 1) % images.length)
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[activeIndex]}
          alt={`${productName} - imagen ${activeIndex + 1} de ${images.length}`}
          fill
          className="object-contain p-4"
          priority={activeIndex === 0}
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow transition-colors hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow transition-colors hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 text-xs text-foreground shadow">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex justify-center gap-2" aria-label="Seleccionar imagen del producto">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative h-16 w-16 overflow-hidden rounded-md border-2 bg-muted transition-colors ${
                index === activeIndex ? "border-primary" : "border-transparent hover:border-primary/50"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
