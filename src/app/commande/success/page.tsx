"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function OrderSuccessPage() {
  const { t } = useI18n()
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("order.successTitle") as string}</h1>
        <p className="text-muted-foreground mb-8">{t("order.successMessage") as string}</p>
        <Button asChild size="lg" className="min-h-[48px] w-full sm:w-auto">
          <Link href="/boutique">{t("order.backToShop") as string}</Link>
        </Button>
      </div>
    </div>
  )
}
