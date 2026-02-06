"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSrc = images?.[currentIndex]
  const hasImages = Array.isArray(images) && images.length > 0

  return (
    <div className="space-y-5">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/20">
        {currentSrc ? (
          <Image
            src={currentSrc}
            alt={`${productName} - image ${currentIndex + 1}`}
            fill
            className="object-cover object-center transition-opacity duration-200"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm" aria-hidden />
        )}
      </div>
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative aspect-square h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out min-h-[44px] min-w-[44px] touch-manipulation bg-muted/30",
                currentIndex === i
                  ? "border-primary ring-2 ring-primary/30 shadow-md"
                  : "border-border/60 hover:border-muted-foreground/50 opacity-90 hover:opacity-100"
              )}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full" aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
