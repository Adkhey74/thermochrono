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
import { ChevronRight, Lock, Shield, CreditCard } from "lucide-react"

const CHECKOUT_DISCOUNT_KEY = "checkoutDiscount"

const mollieLocaleMap: Record<string, string> = {
  fr: "fr_FR",
  en: "en_GB",
}

/** Styles passés à Mollie Components (couleurs, typo) pour correspondre au thème du site */
const mollieComponentStyles = {
  base: {
    color: "#000000",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "1.5",
    "::placeholder": {
      color: "rgba(0, 0, 0, 0.4)",
    },
  },
  valid: {
    color: "#000000",
  },
  invalid: {
    color: "#DC2626",
  },
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
      createComponent: (type: string, options?: { styles?: typeof mollieComponentStyles }) => { mount: (el: string | HTMLElement) => void }
      createToken: () => Promise<{ token?: string; error?: { message: string } }>
    }
    mollieRef.current = mollie
    const cardComponent = mollie.createComponent("card", { styles: mollieComponentStyles })
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
      }
      setPayError(t("checkout.paymentFormUnavailable") as string)
      setPayLoading(false)
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
    <div className="checkout-page min-h-screen bg-[#f8f8f8]">
      <Script
        src="https://js.mollie.com/v1/mollie.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
        <nav
          className="mb-6 sm:mb-8 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
          aria-label={t("common.breadcrumbAria") as string}
        >
          <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors">
            {t("header.home") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
          <Link href="/panier" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors">
            {t("cart.title") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
          <span className="text-foreground font-medium">{t("checkout.title") as string}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-10 items-start">
          {/* Colonne gauche : récapitulatif */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-muted/30">
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                  {t("cart.summary") as string}
                </h2>
              </div>
              <div className="p-5 sm:p-6">
                <ul className="space-y-4">
                  {checkoutItems.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0 ring-1 ring-border/50">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-[15px] leading-snug">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.price.toFixed(2)} € × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground shrink-0 text-[15px]">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.subtotal") as string}</span>
                    <span className="text-foreground font-medium">{subtotal.toFixed(2)} €</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.discount") as string}</span>
                      <span className="text-foreground font-medium text-green-600">−{discountAmount.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3">
                    <span className="font-semibold text-foreground">{t("cart.total") as string}</span>
                    <span className="text-xl font-bold text-foreground">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite : paiement */}
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden sticky top-6">
              <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-gradient-to-b from-muted/40 to-transparent">
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  {t("checkout.title") as string}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("checkout.subtitle") as string}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-foreground" aria-hidden />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                      {t("checkout.cardDetails") as string}
                    </h3>
                  </div>
                  {profileId ? (
                    <>
                      <div
                        ref={cardRef}
                        className="checkout-mollie-card rounded-xl border-2 border-border bg-background p-4 sm:p-5 min-h-[220px] transition-colors focus-within:border-foreground/30"
                      />
                      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3.5 w-3.5 shrink-0" />
                        {t("checkout.secureByMollie") as string}
                      </p>
                    </>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("checkout.paymentFormUnavailable") as string}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t("checkout.paymentFormUnavailableHint") as string}
                      </p>
                    </div>
                  )}
                </section>

                {payError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                    <p className="text-sm text-destructive font-medium" role="alert">
                      {payError}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full min-h-[52px] text-base font-semibold rounded-xl touch-manipulation shadow-sm"
                    disabled={payLoading || !profileId || (profileId && !scriptReady)}
                  >
                    {payLoading
                      ? (t("checkout.paying") as string)
                      : (t("checkout.payButton") as string)}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full min-h-[48px] rounded-xl"
                    asChild
                  >
                    <Link href="/panier">{t("checkout.backToCart") as string}</Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{t("cart.securePayment") as string}</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
