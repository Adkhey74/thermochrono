"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function CheckoutReturnContent() {
  const searchParams = useSearchParams()
  const { t } = useI18n()
  const clearCart = useCartStore((s) => s.clearCart)
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status")
    if (redirectStatus === "succeeded") {
      clearCart()
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("checkoutDiscount")
      }
      setStatus("success")
      return
    }
    if (redirectStatus === "failed" || redirectStatus === "canceled") {
      setStatus("failed")
      return
    }
    setStatus("failed")
  }, [searchParams, clearCart])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("checkout.loading") as string}</p>
        </div>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2 text-green-600">
            {t("order.successTitle") as string}
          </h1>
          <p className="text-muted-foreground mb-8">{t("order.successMessage") as string}</p>
          <Button asChild size="lg">
            <Link href="/boutique">{t("order.backToShop") as string}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-bold mb-2 text-destructive">{t("order.cancelTitle") as string}</h1>
        <p className="text-muted-foreground mb-8">{t("order.cancelMessage") as string}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/panier">{t("cart.title") as string}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/boutique">{t("order.backToShop") as string}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      }
    >
      <CheckoutReturnContent />
    </Suspense>
  )
}
