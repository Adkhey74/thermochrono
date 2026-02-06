"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FAQ_KEYS = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
] as const

export function FaqSection({ className }: { className?: string }) {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className={cn("space-y-4", className)} aria-label={t("faq.title") as string}>
      <h2 className="text-lg font-bold text-foreground">{t("faq.title") as string}</h2>
      <div className="space-y-1">
        {FAQ_KEYS.map(({ q, a }, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={q}
              className="rounded-xl border border-border/80 bg-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-3 py-4 px-4 sm:px-5 text-left text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors min-h-[44px] touch-manipulation"
                aria-expanded={isOpen}
              >
                <span className="flex-1">{t(q) as string}</span>
                <ChevronDown
                  className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(a) as string}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
