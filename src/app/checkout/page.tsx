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
import { ChevronLeft } from "lucide-react"

const CHECKOUT_DISCOUNT_KEY = "checkoutDiscount"

const mollieLocaleMap: Record<string, string> = {
  fr: "fr_FR",
  en: "en_GB",
}

const mollieComponentStyles = {
  base: {
    color: "#171717",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "1.5",
    "::placeholder": {
      color: "rgba(0, 0, 0, 0.35)",
    },
  },
  valid: { color: "#171717" },
  invalid: { color: "#b91c1c" },
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice } = useCartStore()
  const { t, locale } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)
  const mollieRef = useRef<{ createToken: () => Promise<{ token?: string; error?: { message: string } }> } | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const [mollieMounted, setMollieMounted] = useState(false)
  const [mollieError, setMollieError] = useState<string | null>(null)
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
    if (!scriptReady || !profileId || typeof window === "undefined") return
    setMollieError(null)
    const el = cardRef.current
    if (!el) return

    const M = (window as unknown as { Mollie?: (id: string, o?: { locale?: string }) => unknown }).Mollie
    if (!M) {
      setMollieError("Mollie.js non chargé.")
      return
    }

    const mount = () => {
      try {
        const mollie = M(profileId, { locale: mollieLocaleMap[locale] ?? "fr_FR" }) as {
          createComponent: (type: string, options?: { styles?: typeof mollieComponentStyles }) => { mount: (target: string | HTMLElement) => void }
          createToken: () => Promise<{ token?: string; error?: { message: string } }>
        }
        mollieRef.current = mollie
        try {
          const cardComponent = mollie.createComponent("card", { styles: mollieComponentStyles })
          cardComponent.mount(el)
        } catch {
          const cardComponent = mollie.createComponent("card")
          cardComponent.mount(el)
        }
        setMollieMounted(true)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur Mollie"
        setMollieError(msg)
      }
    }

    const t = setTimeout(mount, 100)
    return () => {
      clearTimeout(t)
      mollieRef.current = null
      setMollieMounted(false)
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">{(t("checkout.emptyCart") as string) ?? "Panier vide."}</p>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://js.mollie.com/v1/mollie.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setScriptError(true)}
      />

      {/* Fond : image très adoucie, overlay sombre */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/boris-baldinger-eUFfY6cwjSU-unsplash.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-neutral-900/50" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 min-h-full flex flex-col">
        <header className="flex-shrink-0 pt-6 px-4 sm:px-8">
          <Link
            href="/panier"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors min-h-[44px]"
          >
            <ChevronLeft className="h-5 w-5 shrink-0" />
            {t("checkout.previousPage") as string}
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-[560px]">
            {/* Carte principale */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
              {/* Bloc commande */}
              <div className="px-10 pt-10 pb-7 border-b border-neutral-100">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400">
                  {t("checkout.orderLabel") as string}
                </p>
                <h1 className="mt-2 text-lg font-semibold text-neutral-900 leading-snug">
                  {orderTitle}
                </h1>
                <p className="mt-2 text-2xl font-bold text-neutral-900 tracking-tight">
                  {total.toFixed(2)} €
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-10">
                {/* Zone formulaire carte */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
                    {t("checkout.cardDetails") as string}
                  </p>
                  {profileId ? (
                    <div
                      ref={cardRef}
                      className="checkout-mollie-card rounded-xl bg-neutral-50 border border-neutral-200 p-6 min-h-[240px] relative"
                    >
                      {scriptError && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-100 p-6 text-center">
                          <p className="text-sm text-red-600">Impossible de charger le formulaire de paiement. Vérifiez votre connexion ou désactivez les bloqueurs de publicité.</p>
                        </div>
                      )}
                      {!scriptError && mollieError && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-100 p-6 text-center">
                          <p className="text-sm text-red-600">{mollieError}</p>
                          <p className="mt-2 text-xs text-neutral-500">Vérifiez que NEXT_PUBLIC_MOLLIE_PROFILE_ID est l’ID de profil (pfl_xxx) dans le dashboard Mollie.</p>
                        </div>
                      )}
                      {!scriptError && !mollieError && !mollieMounted && scriptReady && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-100/80 p-6 text-center">
                          <p className="text-sm text-neutral-500">Chargement du formulaire de paiement…</p>
                        </div>
                      )}
                      {!scriptError && !mollieError && !scriptReady && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-100/80 p-6 text-center">
                          <p className="text-sm text-neutral-500">Chargement du formulaire de paiement…</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-neutral-50 border border-neutral-200 border-dashed p-8 text-center">
                      <p className="text-sm text-neutral-500">{t("checkout.paymentFormUnavailable") as string}</p>
                      <p className="mt-2 text-xs text-neutral-500">Ajoutez NEXT_PUBLIC_MOLLIE_PROFILE_ID (ID profil pfl_xxx) dans .env.local</p>
                    </div>
                  )}
                </div>

                {payError && (
                  <div className="mb-6 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
                    <p className="text-sm text-red-800 font-medium" role="alert">{payError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl text-[15px]"
                  disabled={payLoading || !profileId || !scriptReady}
                >
                  {payLoading ? (t("checkout.paying") as string) : (t("checkout.payButton") as string)}
                </Button>
              </form>

              {/* Pied de carte : Mollie */}
              <div className="px-10 pb-8">
                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                  <span>
                    {t("checkout.securePaymentByMollie") as string}{" "}
                    <span className="font-semibold text-neutral-500">mollie</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
