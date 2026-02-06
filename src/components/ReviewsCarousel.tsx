"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { useI18n } from "@/lib/i18n/context"
import { getReviews } from "@/data/reviews"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const AUTO_SCROLL_INTERVAL_MS = 5000

export function ReviewsCarousel() {
  const { t, locale } = useI18n()
  const reviews = getReviews(locale)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    duration: 28,
    containScroll: "trimSnaps",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || reviews.length <= 1) return
    const timer = setInterval(() => emblaApi.scrollNext(), AUTO_SCROLL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [emblaApi, reviews.length])

  if (reviews.length === 0) return null

  return (
    <section className="space-y-8 sm:space-y-10" aria-label={t("reviews.title") as string}>
      <header className="text-center px-2">
        <h2 className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t("reviews.title") as string}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {t("reviews.subtitle") as string}
        </p>
      </header>

      <div className="relative w-full">
        {/* Zone swipe : padding latéral pour que les flèches ne débordent pas sur mobile */}
        <div className="mx-auto max-w-2xl px-10 sm:px-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-2 sm:-ml-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="min-w-0 flex-[0_0_100%] pl-2 pr-2 sm:pl-3 sm:pr-3"
                  role="group"
                  aria-roledescription="slide"
                >
                  <article className="rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden flex flex-col min-h-[220px] sm:min-h-[200px]">
                    {/* Fond discret pour la citation */}
                    <div className="relative p-5 sm:p-6 lg:p-8 flex flex-col flex-1">
                      <Quote className="absolute top-4 right-4 sm:top-5 sm:right-5 h-10 w-10 sm:h-12 sm:w-12 text-primary/[0.07] pointer-events-none" aria-hidden />
                      <div
                        className="flex gap-1 mb-3 sm:mb-4"
                        aria-label={(t("reviews.starLabel") as string).replace("{{count}}", String(review.rating))}
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-5 w-5 sm:h-6 sm:w-6 shrink-0",
                              i <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-foreground text-[15px] sm:text-base leading-relaxed flex-1 pr-6">
                        {review.text}
                      </p>
                      <footer className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-3 flex-wrap">
                        <span className="font-semibold text-foreground text-sm sm:text-base">
                          {review.author}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
                          {review.date}
                        </span>
                      </footer>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Boutons prev/next — zone tactile 44px minimum */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-between pointer-events-none absolute inset-y-0 left-0 right-0 max-w-2xl mx-auto px-0 sm:px-2">
            <button
              type="button"
              onClick={scrollPrev}
              className="pointer-events-auto min-h-[44px] min-w-[44px] sm:h-11 sm:w-11 rounded-full bg-background/95 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 z-[var(--z-above-content)] -ml-2 sm:ml-0"
              aria-label={t("reviews.prev") as string}
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="pointer-events-auto min-h-[44px] min-w-[44px] sm:h-11 sm:w-11 rounded-full bg-background/95 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 z-[var(--z-above-content)] -mr-2 sm:mr-0"
              aria-label={t("reviews.next") as string}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        )}

        {/* Points indicateurs — zone tactile élargie sur mobile */}
        {reviews.length > 1 && (
          <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:p-2 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
                aria-label={(t("reviews.goToReview") as string).replace("{{n}}", String(i + 1))}
                aria-current={i === selectedIndex ? "true" : undefined}
              >
                <span
                  className={cn(
                    "block rounded-full transition-colors",
                    i === selectedIndex
                      ? "w-3 h-3 sm:w-2.5 sm:h-2.5 bg-primary"
                      : "w-2.5 h-2.5 sm:w-2 sm:h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
