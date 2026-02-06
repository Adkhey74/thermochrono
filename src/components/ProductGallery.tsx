"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
  /** URL optionnelle d'une vidéo "produit en action" (YouTube, Vimeo ou direct) */
  videoUrl?: string | null
}

export function ProductGallery({ images, productName, videoUrl }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasVideo = Boolean(videoUrl?.trim())
  const allItems = hasVideo ? ["video", ...(images ?? [])] : images ?? []
  const isVideo = hasVideo && currentIndex === 0
  const currentSrc = hasVideo ? (currentIndex === 0 ? null : images?.[currentIndex - 1]) : images?.[currentIndex]
  const hasImages = Array.isArray(images) && images.length > 0

  return (
    <div className="space-y-5">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/20">
        {isVideo && videoUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              playsInline
              preload="metadata"
            />
          </div>
        ) : currentSrc ? (
          <Image
            src={currentSrc}
            alt={`${productName} - image ${currentIndex + (hasVideo ? 0 : 1)}`}
            fill
            className="object-cover object-center transition-opacity duration-200"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={currentIndex === 0}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm" aria-hidden />
        )}
      </div>
      {(hasVideo || hasImages) && allItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {hasVideo && (
            <button
              type="button"
              onClick={() => setCurrentIndex(0)}
              className={cn(
                "relative aspect-square h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out min-h-[44px] min-w-[44px] touch-manipulation bg-neutral-800 flex items-center justify-center",
                currentIndex === 0
                  ? "border-primary ring-2 ring-primary/30 shadow-md"
                  : "border-border/60 hover:border-muted-foreground/50 opacity-90 hover:opacity-100"
              )}
              title="Vidéo"
            >
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            </button>
          )}
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(hasVideo ? i + 1 : i)}
              className={cn(
                "relative aspect-square h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out min-h-[44px] min-w-[44px] touch-manipulation bg-muted/30",
                (hasVideo ? currentIndex === i + 1 : currentIndex === i)
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
