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
        <p className="text-neutral-500">{(t("cart.checkoutLoading") as string) ?? "Redirection…"}</p>
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
          src="/images/checkout.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-neutral-900/50" />
      </div>

      {/* Contenu : scrollable pour ne jamais couper la modale */}
      <div className="relative z-10 min-h-full flex flex-col">
        <header className="flex-shrink-0 pt-4 pb-2 px-4 sm:pt-6 sm:px-8">
          <Link
            href="/panier"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors min-h-[44px]"
          >
            <ChevronLeft className="h-5 w-5 shrink-0" />
            {t("checkout.previousPage") as string}
          </Link>
        </header>

        <main className="flex-1 flex flex-col items-center px-4 py-4 pb-6 sm:py-6 sm:pb-8 min-h-0 overflow-y-auto">
          <div className="w-full max-w-[520px] flex flex-col items-center my-auto">
            {/* Carte principale : hauteur limitée, contenu scrollable */}
            <div className="w-full bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden flex flex-col max-h-[min(88vh,720px)]">
              {/* En-tête fixe */}
              <div className="flex-shrink-0">
                <div className="flex justify-center pt-4 pb-3 sm:pt-5 sm:pb-4 border-b border-neutral-100">
                <Link href="/" className="block" aria-label={t("common.brandName") as string}>
                  <Image
                    src="/images/logo.png"
                    alt=""
                    width={140}
                    height={42}
                    className="h-12 w-auto sm:h-14 object-contain"
                  />
                </Link>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-neutral-100">
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                    {t("checkout.orderLabel") as string}
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-neutral-900 truncate">{orderTitle}</p>
                  <p className="mt-0.5 text-xl font-bold text-neutral-900">{total.toFixed(2)} €</p>
                </div>
              </div>

              {/* Zone scrollable : paiement */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="px-4 pt-3 sm:px-6">
                  <Link
                    href="/panier/livraison"
                    className="text-xs text-neutral-500 hover:text-neutral-700 underline"
                  >
                    {t("checkout.backToDelivery") as string}
                  </Link>
                </div>
                  <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col">
                    <div className="mb-4">
                      <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-3">
                        {t("checkout.cardDetails") as string}
                      </p>
                  {profileId ? (
                    <div
                      ref={(el) => {
                        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el
                        setContainerReady(!!el)
                      }}
                      className="checkout-mollie-card rounded-xl bg-neutral-50 border border-neutral-200 p-3 sm:p-4 min-h-[200px] sm:min-h-[220px] relative"
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
                      {!scriptError && !mollieError && !mollieMounted && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-neutral-100/80 p-6 text-center">
                          <p className="text-sm text-neutral-500">Chargement du formulaire de paiement…</p>
                          {(loadTimeout || profileIdLooksWrong) && (
                            <p className="mt-3 text-xs text-neutral-500 max-w-[280px]">
                              {profileIdLooksWrong
                                ? "Utilisez l’ID de profil Mollie (commence par pfl_), pas la clé API (test_/live_). Dashboard Mollie → Développeurs → Clés API."
                                : "Le formulaire met du temps à s’afficher. Vérifiez que NEXT_PUBLIC_MOLLIE_PROFILE_ID est bien l’ID de profil pfl_xxx dans le dashboard Mollie."}
                            </p>
                          )}
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
                      <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                        <p className="text-xs text-red-800 font-medium" role="alert">{payError}</p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl text-sm shrink-0"
                      disabled={payLoading || !profileId || !scriptReady}
                    >
                      {payLoading ? (t("checkout.paying") as string) : (t("checkout.payButton") as string)}
                    </Button>
                  </form>
                  <div className="px-4 pb-4 sm:px-6 sm:pb-5 shrink-0">
                    <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                      <span>
                        {t("checkout.securePaymentByMollie") as string}{" "}
                        <span className="font-semibold text-neutral-500">mollie</span>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
