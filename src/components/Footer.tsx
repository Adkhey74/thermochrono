"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { PaymentMethods } from "@/components/PaymentMethods"

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-5">
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {t("footer.description") as string}
            </p>
            <a href="mailto:contact@boutique.fr" className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 p-3 rounded-lg transition-all duration-200 border border-primary-foreground/20">
              <Mail className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground">contact@boutique.fr</span>
            </a>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-bold text-primary-foreground">{t("footer.shop") as string}</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/boutique" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-200 ease-out inline-flex items-center min-h-[44px] py-2 hover:translate-x-0.5 touch-manipulation">
                  {t("footer.allProducts") as string}
                </Link>
              </li>
              <li>
                <Link href="/panier" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-200 ease-out inline-flex items-center min-h-[44px] py-2 hover:translate-x-0.5 touch-manipulation">
                  {t("header.cart") as string}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-bold text-primary-foreground">{t("footer.usefulLinks") as string}</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/mentions-legales" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-200 ease-out inline-flex items-center min-h-[44px] py-2 hover:translate-x-0.5 touch-manipulation">
                  {t("footer.legal") as string}
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-200 ease-out inline-flex items-center min-h-[44px] py-2 hover:translate-x-0.5 touch-manipulation">
                  {t("footer.privacy") as string}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 space-y-6">
          <PaymentMethods light className="[&_p]:text-primary-foreground/70 [&_.flex]:border-primary-foreground/20 [&_.flex]:bg-primary-foreground/5" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/70 text-sm text-center md:text-left">
              {t("footer.copyright") as string}
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <Link href="/mentions-legales" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center py-2 touch-manipulation">
                {t("footer.legal") as string}
              </Link>
              <Link href="/confidentialite" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center py-2 touch-manipulation">
                {t("footer.privacy") as string}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
