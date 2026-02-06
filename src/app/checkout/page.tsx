"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/store/cart-store"
import { useI18n } from "@/lib/i18n/context"
import { getProductDisplay } from "@/lib/i18n/product-display"
import { getProductById, getVariant } from "@/data/products"
import { CheckoutForm } from "@/components/CheckoutForm"
import { ApplePayButton } from "@/components/ApplePayButton"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore()
  const { t } = useI18n()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (items.length === 0 || clientSecret) return
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem("checkoutDiscount") : null
    let discountAmount = 0
    if (stored) {
      try {
        const { discount: d } = JSON.parse(stored)
        discountAmount = Number(d) || 0
        setDiscount(discountAmount)
      } catch {
        // ignore
      }
    }
    const checkoutItems = items
      .map((item) => {
        const p = getProductById(item.productId)
        const v = p && getVariant(p, item.variantId)
        if (!p || !v) return null
        const display = getProductDisplay(p, t, v)
        return {
          productId: p.id,
          name: display.color ? `${display.name} — ${display.color}` : display.name,
          price: v.price,
          quantity: item.quantity,
          image: v.images[0] ?? "",
        }
      })
      .filter(Boolean) as { productId: string; name: string; price: number; quantity: number; image: string }[]
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: checkoutItems,
        discountAmount: discountAmount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else if (data.clientSecret) setClientSecret(data.clientSecret)
      })
      .catch(() => setError(t("checkout.errorCreating") as string))
  }, [items, t, clientSecret])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground mb-6">{t("checkout.emptyCart") as string}</p>
          <Button asChild size="lg">
            <Link href="/panier">{t("checkout.backToCart") as string}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = totalPrice()
  const finalTotal = Math.max(0, subtotal - discount)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <nav
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
          aria-label={t("common.breadcrumbAria") as string}
        >
          <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground">
            {t("header.home") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href="/panier" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground">
            {t("cart.title") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-foreground font-medium">{t("checkout.title") as string}</span>
        </nav>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">{t("checkout.title") as string}</h1>
          <p className="text-muted-foreground mb-6">
            {t("cart.total") as string} : <span className="font-semibold text-foreground">{finalTotal.toFixed(2)} €</span>
          </p>

          {error && (
            <p className="text-destructive mb-4" role="alert">
              {error}
            </p>
          )}

          {!publishableKey && (
            <p className="text-destructive mb-4" role="alert">
              Clé Stripe manquante. Ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans .env.local (ex. pk_test_...).
            </p>
          )}

          {!clientSecret && !error && publishableKey && (
            <p className="text-muted-foreground">{t("checkout.loading") as string}</p>
          )}

          {clientSecret && stripePromise && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                locale: "fr",
                appearance: {
                  theme: "stripe",
                  variables: {
                    borderRadius: "0.75rem",
                  },
                },
              }}
            >
              <ApplePayButton
                clientSecret={clientSecret}
                amountInCents={Math.round(finalTotal * 100)}
              />
              <p className="text-center text-sm text-muted-foreground mb-4">
                — {t("checkout.orPayWithCard") as string} —
              </p>
              <CheckoutForm />
            </Elements>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <Button variant="outline" className="w-full min-h-[48px]" asChild>
              <Link href="/panier">{t("checkout.backToCart") as string}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
