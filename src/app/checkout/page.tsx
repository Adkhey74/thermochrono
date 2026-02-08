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
import { ChevronLeft, CreditCard } from "lucide-react"

const CHECKOUT_DISCOUNT_KEY = "checkoutDiscount"

const mollieLocaleMap: Record<string, string> = {
  fr: "fr_FR",
  en: "en_GB",
}

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
  valid: { color: "#000000" },
  invalid: { color: "#DC2626" },
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

  const orderTitle =
    checkoutItems.length === 1
      ? checkoutItems[0].name
      : `${checkoutItems.length} ${(t("cart.items") as string).toLowerCase()}`

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
          body: JSON.stringify({ items: checkoutItems, discountAmount, cardToken: token }),
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
    <div className="checkout-page min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8 sm:py-12">
      <Script
        src="https://js.mollie.com/v1/mollie.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      {/* Fond plein écran : image floutée + marque */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/gourde_noir_woman.jpg"
          alt=""
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <span className="text-white/20 text-[clamp(4rem,20vw,12rem)] font-bold tracking-[0.2em] uppercase select-none">
            {t("common.brandName") as string}
          </span>
        </div>
      </div>

      {/* Lien retour */}
      <Link
        href="/panier"
        className="absolute top-6 left-4 sm:left-6 z-10 flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors min-h-[44px]"
      >
        <ChevronLeft className="h-5 w-5 shrink-0" />
        {t("checkout.previousPage") as string}
      </Link>

      {/* Carte blanche centrée (style Veloretti) */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* En-tête commande */}
        <div className="px-6 pt-6 pb-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            {t("checkout.orderLabel") as string}
          </p>
          <h1 className="text-xl font-bold text-black mt-1">
            {orderTitle}
          </h1>
          <p className="text-lg font-semibold text-black mt-1">
            {total.toFixed(2)} €
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Paiement par carte */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-neutral-700" aria-hidden />
              <span className="text-sm font-medium text-neutral-700">
                {t("checkout.cardDetails") as string}
              </span>
            </div>
            {profileId ? (
              <div
                ref={cardRef}
                className="checkout-mollie-card rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 min-h-[200px]"
              />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-6 text-center">
                <p className="text-sm text-neutral-500">{t("checkout.paymentFormUnavailable") as string}</p>
              </div>
            )}
          </div>

          {payError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700 font-medium" role="alert">{payError}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full min-h-[52px] bg-black hover:bg-neutral-800 text-white font-semibold rounded-xl text-base"
            disabled={payLoading || !profileId || !scriptReady}
          >
            {payLoading ? (t("checkout.paying") as string) : (t("checkout.payButton") as string)}
          </Button>

          {/* Footer Mollie */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
            <span>
              {t("checkout.securePaymentByMollie") as string}{" "}
              <strong className="font-semibold text-neutral-700">mollie</strong>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
