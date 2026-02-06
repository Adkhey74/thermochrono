"use client"

import { useI18n } from "@/lib/i18n/context"

export function PromoBar() {
  const { t } = useI18n()
  const text = t("promo.barText") as string
  const repeated = Array(12).fill(text).join("  ◆  ")

  return (
    <div className="relative overflow-hidden w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white/95 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] border-b border-white/10">
      <div className="flex w-max min-w-full animate-marquee whitespace-nowrap items-center">
        <span className="px-6 text-[0.9em]">{repeated}</span>
        <span className="px-6 text-[0.9em]" aria-hidden>{repeated}</span>
      </div>
    </div>
  )
}
