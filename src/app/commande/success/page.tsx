"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface SessionDetails {
  email: string | null
  phone: string | null
  name: string | null
  address: {
    line1: string | null
    line2: string | null
    city: string | null
    postal_code: string | null
    country: string | null
  } | null
}

function formatAddress(addr: SessionDetails["address"], name: string | null): string {
  if (!addr) return ""
  const parts = [
    name?.trim(),
    addr.line1,
    addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(" "),
    addr.country,
  ].filter(Boolean) as string[]
  return parts.join(", ")
}

export default function OrderSuccessPage() {
  const { t } = useI18n()
  const clearCart = useCartStore((s) => s.clearCart)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [details, setDetails] = useState<SessionDetails | null>(null)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  useEffect(() => {
    if (!sessionId) return
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && (data.email || data.address)) setDetails(data)
      })
      .catch(() => {})
  }, [sessionId])

  const shippingLine = details?.address
    ? formatAddress(details.address, details.name ?? null)
    : null

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("order.successTitle") as string}</h1>
        <p className="text-muted-foreground mb-6">{t("order.successMessage") as string}</p>

        {details && (shippingLine || details.email) && (
          <div className="mb-8 text-left rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            {details.email && (
              <p className="text-sm">
                <span className="text-muted-foreground">{t("order.confirmationSentTo") as string} </span>
                <span className="font-medium text-foreground">{details.email}</span>
              </p>
            )}
            {shippingLine && (
              <p className="text-sm">
                <span className="text-muted-foreground">{t("order.shippingTo") as string} </span>
                <span className="font-medium text-foreground">{shippingLine}</span>
              </p>
            )}
            {details.phone && (
              <p className="text-sm text-muted-foreground">
                {t("order.phoneLabel") as string} {details.phone}
              </p>
            )}
          </div>
        )}

        <Button asChild size="lg" className="min-h-[48px] w-full sm:w-auto">
          <Link href="/boutique">{t("order.backToShop") as string}</Link>
        </Button>
      </div>
    </div>
  )
}
