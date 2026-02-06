"use client"

import { useI18n } from "@/lib/i18n/context"
import { getReviews } from "@/data/reviews"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductReviewsProps {
  /** Afficher seulement les N premiers avis (défaut: tous) */
  limit?: number
  className?: string
}

export function ProductReviews({ limit, className }: ProductReviewsProps) {
  const { t, locale } = useI18n()
  const reviews = getReviews(locale)
  const displayReviews = limit ? reviews.slice(0, limit) : reviews

  if (displayReviews.length === 0) return null

  const avgRating =
    displayReviews.reduce((acc, r) => acc + r.rating, 0) / displayReviews.length
  const roundedRating = Math.round(avgRating * 10) / 10

  return (
    <section className={cn("space-y-6", className)} aria-label={t("reviews.title") as string}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{t("reviews.title") as string}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t("reviews.subtitle") as string}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="text-lg font-bold text-foreground">{roundedRating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {(t("reviews.reviewCount") as string).replace("{{count}}", String(displayReviews.length))}
          </span>
        </div>
      </div>
      <ul className="space-y-4">
        {displayReviews.map((review) => (
          <li
            key={review.id}
            className="relative pl-5 py-3 border-l-2 border-primary/20"
          >
            <Quote className="absolute left-1 top-3 h-4 w-4 text-primary/15" aria-hidden />
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex gap-0.5" aria-label={(t("reviews.starLabel") as string).replace("{{count}}", String(review.rating))}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{review.author}</span>
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
