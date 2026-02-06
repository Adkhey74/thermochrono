"use client"

import Link from "next/link"
import { ChevronRight, Target, Shield, Truck, Lock } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function AboutPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <nav
              className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
              aria-label={t("common.breadcrumbAria") as string}
            >
              <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground">
                {t("header.home") as string}
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="text-foreground font-medium">{t("about.title") as string}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("about.title") as string}</h1>
            <p className="text-muted-foreground mb-8">{t("about.intro") as string}</p>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-8">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                  <Target className="h-5 w-5 text-primary" />
                  {t("about.mission") as string}
                </h2>
                <p className="text-muted-foreground">{t("about.missionText") as string}</p>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  {t("about.values") as string}
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{t("about.quality") as string}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("about.delivery") as string}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("about.secure") as string}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("home.viewShop") as string}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
              >
                {t("header.contact") as string}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
