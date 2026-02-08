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
import { loadShipping, hasValidShipping } from "@/lib/checkout-shipping"

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
  const [containerReady, setContainerReady] = useState(false)
  const [mollieMounted, setMollieMounted] = useState(false)
  const [mollieError, setMollieError] = useState<string | null>(null)
  const [loadTimeout, setLoadTimeout] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [shippingAddress, setShippingAddress] = useState<ReturnType<typeof loadShipping> | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CHECKOUT_DISCOUNT_KEY)
      if (raw) {
        const data = JSON.parse(raw) as { discount?: number }
        if (typeof data.discount === "number") setDiscountAmount(data.discount)
      }
      const shipping = loadShipping()
      if (!hasValidShipping(shipping)) {
        router.replace("/panier/livraison")
        return
      }
      setShippingAddress(shipping)
    } catch {
      router.replace("/panier/livraison")
    }
  }, [router])

  // Au démontage (retour arrière, navigation), réinitialiser containerReady pour que
  // le formulaire Mollie se remonte correctement quand on revient sur la page.
  useEffect(() => {
    return () => {
      setContainerReady(false)
      setMollieMounted(false)
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
  const profileIdLooksWrong = profileId.length > 0 && !profileId.startsWith("pfl_")

  const orderTitle =
    checkoutItems.length === 1
      ? checkoutItems[0].name
      : `${checkoutItems.length} ${(t("cart.items") as string).toLowerCase()}`

  useEffect(() => {
    if (!scriptReady || !profileId || !containerReady || typeof window === "undefined") return
    setMollieError(null)
    setLoadTimeout(false)
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

    const t = setTimeout(mount, 200)
    const timeoutId = setTimeout(() => setLoadTimeout(true), 8000)
    return () => {
      clearTimeout(t)
      clearTimeout(timeoutId)
      mollieRef.current = null
      setMollieMounted(false)
    }
  }, [scriptReady, profileId, locale, containerReady])

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
        if (!shippingAddress) {
          setPayError(t("checkout.paymentFormUnavailable") as string)
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
            shippingAddress: {
              givenName: shippingAddress.firstName.trim(),
              familyName: shippingAddress.lastName.trim(),
              email: shippingAddress.email.trim(),
              phone: shippingAddress.phone.trim() || undefined,
              streetAndNumber: shippingAddress.streetAndNumber.trim(),
              streetAdditional: shippingAddress.streetAdditional.trim() || undefined,
              postalCode: shippingAddress.postalCode.trim(),
              city: shippingAddress.city.trim(),
              country: shippingAddress.country.trim().toUpperCase().slice(0, 2),
            },
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">{(t("checkout.emptyCart") as string) ?? "Panier vide."}</p>
      </div>
    )
  }

  if (!shippingAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">{(t("cart.checkoutLoading") as string) ?? "Redirection..."}</p>
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

      <div className="min-h-full flex flex-col">
        <main className="flex-1 w-full py-6 px-4 sm:py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Carte blanche type Stripe : deux colonnes sur desktop */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200/80 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-0">
                {/* Colonne gauche : Order Summary */}
                <div className="p-6 sm:p-8 lg:py-8 lg:px-10 border-b lg:border-b-0 lg:border-r border-neutral-200">
                  <Link
                    href="/panier"
                    className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 mb-6 min-h-[44px] items-center touch-manipulation"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{t("checkout.previousPage") as string}</span>
                  </Link>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-5">
                    {t("cart.summary") as string}
                  </h2>
                  <ul className="space-y-4">
                    {checkoutItems.map((item, idx) => (
                      <li key={`${item.productId}-${idx}`} className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs" aria-hidden />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-neutral-900 text-sm line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-sm text-neutral-500 mt-0.5">
                            {item.quantity} × {item.price.toFixed(2)} €
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 tabular-nums shrink-0">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-neutral-200 space-y-2">
                    <div className="flex justify-between text-sm text-neutral-600">
                      <span>{t("cart.subtotal") as string}</span>
                      <span className="tabular-nums">{subtotal.toFixed(2)} €</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{t("cart.discount") as string}</span>
                        <span className="tabular-nums">−{discountAmount.toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-2">
                      <span>{t("cart.total") as string}</span>
                      <span className="tabular-nums text-base">{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Colonne droite : Paiement */}
                <div className="p-6 sm:p-8 lg:py-8 lg:px-10 flex flex-col">
                  <div className="flex-1 flex flex-col min-h-0">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-1">
                      {t("checkout.cardDetails") as string}
                    </h2>
                    <Link
                      href="/panier/livraison"
                      className="text-sm text-neutral-500 hover:text-neutral-700 underline underline-offset-2 mb-5 inline-block"
                    >
                      {t("checkout.backToDelivery") as string}
                    </Link>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                      {profileId ? (
                        <div
                          ref={(el) => {
                            (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el
                            setContainerReady(!!el)
                          }}
                          className="checkout-mollie-card rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 min-h-[200px] sm:min-h-[220px] relative"
                        >
                          {scriptError && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-neutral-100 p-6 text-center">
                              <p className="text-sm text-red-600">Impossible de charger le formulaire de paiement.</p>
                            </div>
                          )}
                          {!scriptError && mollieError && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-neutral-100 p-6 text-center">
                              <p className="text-sm text-red-600">{mollieError}</p>
                            </div>
                          )}
                          {!scriptError && !mollieError && !mollieMounted && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-neutral-50 p-6 text-center">
                              <p className="text-sm text-neutral-500">Chargement du formulaire de paiement...</p>
                              {(loadTimeout || profileIdLooksWrong) && (
                                <p className="mt-2 text-xs text-neutral-400 max-w-[260px]">
                                  {profileIdLooksWrong
                                    ? "Vérifiez NEXT_PUBLIC_MOLLIE_PROFILE_ID (ID pfl_xxx)."
                                    : "Affichage en cours..."}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-neutral-200 border-dashed bg-neutral-50 p-8 text-center">
                          <p className="text-sm text-neutral-500">{t("checkout.paymentFormUnavailable") as string}</p>
                        </div>
                      )}

                      {payError && (
                        <div className="mt-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3" role="alert">
                          <p className="text-sm text-red-800 font-medium">{payError}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        className="mt-6 w-full min-h-[52px] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg text-[15px] touch-manipulation"
                        disabled={payLoading || !profileId || !scriptReady}
                      >
                        {payLoading ? (t("checkout.paying") as string) : (t("checkout.payButton") as string)}
                      </Button>
                    </form>
                  </div>
                  <p className="mt-6 pt-5 border-t border-neutral-100 text-xs text-neutral-400">
                    {t("checkout.securePaymentByMollie") as string}{" "}
                    <span className="font-medium text-neutral-500">Mollie</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
