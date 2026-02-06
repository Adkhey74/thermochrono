"use client"

import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function ContactPage() {
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
              <span className="text-foreground font-medium">{t("contact.title") as string}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("contact.title") as string}</h1>
            <p className="text-muted-foreground mb-8">{t("contact.intro") as string}</p>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{t("contact.email") as string}</p>
                  <a
                    href="mailto:contact@boutique.fr"
                    className="text-primary hover:underline font-medium"
                  >
                    contact@boutique.fr
                  </a>
                  <div className="mt-5">
                    <Button asChild>
                      <a href="mailto:contact@boutique.fr">
                        {t("contact.sendEmail") as string}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-4 border-t border-border">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{t("contact.address") as string}</p>
                  <p className="text-muted-foreground">
                    Adil KHADICH<br />
                    13 rue Henri Verjus
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm text-muted-foreground text-center">
              <Link href="/boutique" className="text-primary hover:underline font-medium">
                {t("home.viewShop") as string}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
