"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart-store"
import { useI18n } from "@/lib/i18n/context"
import { getProductById, getVariant } from "@/data/products"
import { getProductDisplay } from "@/lib/i18n/product-display"
import { Button } from "@/components/ui/button"
import { ChevronRight, Lock, Shield } from "lucide-react"

const CHECKOUT_DISCOUNT_KEY = "checkoutDiscount"

const mollieLocaleMap: Record<string, string> = {
  fr: "fr_FR",
  en: "en_GB",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice } = useCartStore()
  const { t, locale } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)
  const mollieRef = useRef<{ createToken: () => Promise<{ token?: string; error?: { message: string } }> } | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CHECKOUT_DISCOUNT_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as { discount?: number }
      if (typeof data.discount === "number") setDiscountAmount(data.discount)
    } catch {
      // ignore
    }
  }, [])

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

  const subtotal = totalPrice()
  const total = Math.max(0.01, subtotal - discountAmount)
  const profileId = process.env.NEXT_PUBLIC_MOLLIE_PROFILE_ID?.trim() ?? ""

  useEffect(() => {
    if (!scriptReady || !profileId || !cardRef.current || typeof window === "undefined") return
    const M = (window as unknown as { Mollie?: (id: string, o?: { locale?: string }) => unknown }).Mollie
    if (!M) return
    const mollie = M(profileId, { locale: mollieLocaleMap[locale] ?? "fr_FR" }) as {
      createComponent: (type: string) => { mount: (el: string | HTMLElement) => void }
      createToken: () => Promise<{ token?: string; error?: { message: string } }>
    }
    mollieRef.current = mollie
    const cardComponent = mollie.createComponent("card")
    cardComponent.mount(cardRef.current)
    return () => {
      mollieRef.current = null
    }
  }, [scriptReady, profileId, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPayError(null)
    setPayLoading(true)
    try {
      if (profileId && mollieRef.current) {
        const { token, error } = await mollieRef.current.createToken()
        if (error) {
          setPayError(error.message ?? (t("checkout.cardError") as string))
          setPayLoading(false)
          return
        }
        if (!token) {
          setPayError(t("checkout.cardError") as string)
          setPayLoading(false)
          return
        }
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: checkoutItems,
            discountAmount,
            cardToken: token,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? (t("cart.checkoutError") as string))
        if (data.url) {
          window.location.href = data.url
          return
        }
        throw new Error(t("cart.checkoutError") as string)
      } else {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: checkoutItems, discountAmount }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? (t("cart.checkoutError") as string))
        if (data.url) {
          window.location.href = data.url
          return
        }
        throw new Error(t("cart.checkoutError") as string)
      }
    } catch (err) {
      setPayError(err instanceof Error ? err.message : (t("cart.checkoutError") as string))
      setPayLoading(false)
    }
  }

  if (items.length === 0) {
    router.replace("/panier")
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">{(t("checkout.emptyCart") as string) ?? "Panier vide."}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Script
        src="https://js.mollie.com/v1/mollie.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
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

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-border bg-muted/20">
            <h1 className="text-2xl font-bold text-foreground">{t("checkout.title") as string}</h1>
            <p className="text-muted-foreground mt-1">{t("checkout.subtitle") as string}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <section>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">{t("cart.summary") as string}</h2>
              <ul className="space-y-3">
                {checkoutItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toFixed(2)} € × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-foreground shrink-0">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-border space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.subtotal") as string}</span>
                  <span className="text-foreground">{subtotal.toFixed(2)} €</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.discount") as string}</span>
                    <span className="text-foreground">−{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-foreground pt-2">
                  <span>{t("cart.total") as string}</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </section>

            <form onSubmit={handleSubmit} className="space-y-6">
              {profileId && (
                <section>
                  <h2 className="text-sm font-medium text-foreground mb-3">
                    {t("checkout.cardDetails") as string}
                  </h2>
                  <div
                    ref={cardRef}
                    className="rounded-xl border border-border bg-background p-4 min-h-[200px] [&_.mollie-component]:!rounded-lg"
                  />
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    {t("checkout.secureByMollie") as string}
                  </p>
                </section>
              )}

              {payError && (
                <p className="text-sm text-destructive" role="alert">
                  {payError}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full min-h-[48px] touch-manipulation"
                  disabled={payLoading || (!!profileId && !scriptReady)}
                >
                  {payLoading
                    ? (t("checkout.paying") as string)
                    : profileId
                      ? (t("checkout.payButton") as string)
                      : (t("checkout.goToPayment") as string)}
                </Button>
                <Button variant="outline" size="lg" className="w-full min-h-[48px]" asChild>
                  <Link href="/panier">{t("checkout.backToCart") as string}</Link>
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 shrink-0" />
              {t("cart.securePayment") as string}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
