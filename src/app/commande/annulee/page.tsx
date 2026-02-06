"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function OrderCancelPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <XCircle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("order.cancelTitle") as string}</h1>
        <p className="text-muted-foreground mb-8">{t("order.cancelMessage") as string}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="min-h-[48px]">
            <Link href="/panier">{t("cart.title") as string}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-[48px]">
            <Link href="/boutique">{t("order.backToShop") as string}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
