"use client"

import { useI18n } from "@/lib/i18n/context"
import { Truck } from "lucide-react"

export function PromoBar() {
  const { t } = useI18n()
  const textDesktop = t("promo.barText") as string
  const textMobile = t("promo.barTextMobile") as string

  return (
    <div className="w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white/95 py-2 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-sm font-semibold uppercase tracking-wider sm:tracking-[0.2em] border-b border-white/10 flex items-center justify-center gap-1.5 sm:gap-2">
      <Truck className="h-3.5 w-3.5 sm:h-5 sm:w-5 shrink-0" aria-hidden />
      <span className="sm:hidden">{textMobile}</span>
      <span className="hidden sm:inline">{textDesktop}</span>
    </div>
  )
}
