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
import { ChevronLeft, Loader2, Lock, Check, Package, Shield, CreditCard } from "lucide-react"
import { loadShipping, hasValidShipping } from "@/lib/checkout-shipping"

const CHECKOUT_DISCOUNT_KEY = "checkoutDiscount"

interface ApplePayPaymentRequest {
  countryCode: string
  currencyCode: string
  supportedNetworks: string[]
  merchantCapabilities: string[]
  total: { label: string; amount: string }
}
interface ApplePaySessionType {
  begin(): void
  abort(): void
  completeMerchantValidation(merchantSession: unknown): void
  completePayment(status: number): void
  onvalidatemerchant?: (event: { validationURL: string }) => void
  onpaymentauthorized?: (event: { payment: { token: unknown } }) => void
  oncancel?: () => void
}

const mollieLocaleMap: Record<string, string> = {
  fr: "fr_FR",
  en: "en_GB",
}
// Mode test : uniquement si variable explicitement "true" ET pas en prod. Sur Vercel production on force toujours live.
const isVercelProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
const mollieTestMode =
  !isVercelProduction && process.env.NEXT_PUBLIC_MOLLIE_TESTMODE === "true"

const mollieComponentStyles = {
  base: {
    color: "#171717",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "1.5",
    "::placeholder": {
      color: "#737373",
      opacity: 1,
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
  const [applePayAvailable, setApplePayAvailable] = useState(false)
  const [applePayLoading, setApplePayLoading] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [shippingAddress, setShippingAddress] = useState<ReturnType<typeof loadShipping> | null>(null)
  const [showCardNumberHint, setShowCardNumberHint] = useState(true)
  const [showCvcHint, setShowCvcHint] = useState(true)
  const cardNumberWrapRef = useRef<HTMLDivElement>(null)
  const cvcWrapRef = useRef<HTMLDivElement>(null)

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

  // Au retour sur la page, le script Mollie est déjà en cache : onLoad ne se redéclenche pas.
  // On détecte window.Mollie pour débloquer scriptReady et permettre le montage.
  useEffect(() => {
    if (typeof window === "undefined") return
    const M = (window as unknown as { Mollie?: unknown }).Mollie
    if (M) setScriptReady(true)
  }, [])

  // Vérifier si Apple Pay est disponible (Safari / iOS)
  useEffect(() => {
    if (typeof window === "undefined") return
    const ApplePaySession = (window as unknown as { ApplePaySession?: unknown }).ApplePaySession
    if (!ApplePaySession || typeof (ApplePaySession as { canMakePayments?: () => boolean | Promise<boolean> }).canMakePayments !== "function") {
      return
    }
    const check = (ApplePaySession as { canMakePayments: () => boolean | Promise<boolean> }).canMakePayments()
    if (typeof check === "boolean") {
      setApplePayAvailable(check)
    } else {
      void (check as Promise<boolean>).then(setApplePayAvailable)
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
        variantId: item.variantId,
        name: display.color ? `${display.name} — ${display.color}` : display.name,
        price: v.price,
        quantity: item.quantity,
        image: v.images[0] ?? "",
      }
    })
    .filter(Boolean) as { productId: string; variantId: string; name: string; price: number; quantity: number; image: string }[]

  const subtotal = totalPrice()
  const total = Math.max(0.01, subtotal - discountAmount)
  const profileId = process.env.NEXT_PUBLIC_MOLLIE_PROFILE_ID?.trim() ?? ""
  const profileIdLooksWrong = profileId.length > 0 && !profileId.startsWith("pfl_")

  const orderTitle =
    checkoutItems.length === 1
      ? checkoutItems[0].name
      : `${checkoutItems.length} ${(t("cart.items") as string).toLowerCase()}`

  // Montage du formulaire carte Mollie : attente de Mollie + layout, avec retries
  useEffect(() => {
    if (!scriptReady || !profileId || !containerReady || typeof window === "undefined") return
    setMollieError(null)
    setLoadTimeout(false)
    const el = cardRef.current
    if (!el) return

    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const tryMount = (attempt = 0) => {
      if (cancelled) return
      const M = (window as unknown as { Mollie?: (id: string, o?: { locale?: string }) => unknown }).Mollie
      if (!M) {
        if (attempt < 8) {
          timeouts.push(setTimeout(() => tryMount(attempt + 1), 150 + attempt * 100))
        } else {
          setMollieError("Mollie.js non chargé.")
        }
        return
      }
      // Attendre que le conteneur soit peint (dimensions disponibles) avant mount
      requestAnimationFrame(() => {
        if (cancelled) return
        requestAnimationFrame(() => {
          if (cancelled) return
          const container = cardRef.current
          if (!container) return
          try {
            const mollie = M(profileId, {
              locale: mollieLocaleMap[locale] ?? "fr_FR",
              testmode: mollieTestMode,
            } as { locale?: string }) as {
              createComponent: (type: string, options?: { styles?: typeof mollieComponentStyles }) => { mount: (target: string | HTMLElement) => void }
              createToken: () => Promise<{ token?: string; error?: { message: string } }>
            }
            mollieRef.current = mollie
            const opts = { styles: mollieComponentStyles }
            const placeholders =
              locale === "en"
                ? { cardNumber: "1234 5678 9012 3456", expiry: "MM / YY", cvc: "123" }
                : { cardNumber: "1234 5678 9012 3456", expiry: "MM / AA", cvc: "123" }
            const cardNumberEl = container.querySelector("[data-mollie=cardNumber]")
            const cardHolderEl = container.querySelector("[data-mollie=cardHolder]")
            const expiryEl = container.querySelector("[data-mollie=expiryDate]")
            const cvcEl = container.querySelector("[data-mollie=verificationCode]")
            if (cardNumberEl && cardHolderEl && expiryEl && cvcEl) {
              try {
                mollie
                  .createComponent("cardNumber", { ...opts, placeholder: placeholders.cardNumber } as typeof opts & { placeholder?: string })
                  .mount(cardNumberEl as HTMLElement)
                mollie.createComponent("cardHolder", opts).mount(cardHolderEl as HTMLElement)
                mollie
                  .createComponent("expiryDate", { ...opts, placeholder: placeholders.expiry } as typeof opts & { placeholder?: string })
                  .mount(expiryEl as HTMLElement)
                mollie
                  .createComponent("verificationCode", { ...opts, placeholder: placeholders.cvc } as typeof opts & { placeholder?: string })
                  .mount(cvcEl as HTMLElement)
              } catch {
                mollie.createComponent("cardNumber").mount(cardNumberEl as HTMLElement)
                mollie.createComponent("cardHolder").mount(cardHolderEl as HTMLElement)
                mollie.createComponent("expiryDate").mount(expiryEl as HTMLElement)
                mollie.createComponent("verificationCode").mount(cvcEl as HTMLElement)
              }
            } else {
              const cardComponent = mollie.createComponent("card", opts)
              cardComponent.mount(container)
            }
            if (!cancelled) setMollieMounted(true)
          } catch (err) {
            if (!cancelled) {
              const msg = err instanceof Error ? err.message : "Erreur Mollie"
              const isProfileNotFound = /profile\s+.*\s+not\s+found/i.test(msg)
              setMollieError(
                isProfileNotFound
                  ? `${msg} ${t("checkout.profileNotFoundHint") as string}`
                  : msg
              )
            }
          }
        })
      })
    }

    const firstDelay = setTimeout(() => tryMount(0), 100)
    timeouts.push(firstDelay)
    const loadTimeoutId = setTimeout(() => setLoadTimeout(true), 8000)

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
      clearTimeout(loadTimeoutId)
      mollieRef.current = null
      setMollieMounted(false)
    }
  }, [scriptReady, profileId, locale, containerReady])

  // Masquer les placeholders quand l'utilisateur focus ou tape dans le champ (iframe)
  useEffect(() => {
    if (!mollieMounted) return
    const wrapCard = cardNumberWrapRef.current
    const wrapCvc = cvcWrapRef.current
    const hideIfFocused = () => {
      const active = document.activeElement
      if (active && wrapCard?.contains(active)) setShowCardNumberHint(false)
      if (active && wrapCvc?.contains(active)) setShowCvcHint(false)
    }
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Node
      if (wrapCard?.contains(target)) setShowCardNumberHint(false)
      if (wrapCvc?.contains(target)) setShowCvcHint(false)
    }
    const onMouseDown = () => {
      hideIfFocused()
    }
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("mousedown", onMouseDown)
    const interval = setInterval(hideIfFocused, 150)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("mousedown", onMouseDown)
      clearInterval(interval)
    }
  }, [mollieMounted])

  const handleApplePay = () => {
    if (!shippingAddress || applePayLoading || payLoading) return
    if (typeof window === "undefined" || !(window as unknown as { ApplePaySession?: unknown }).ApplePaySession) return
    setPayError(null)
    setApplePayLoading(true)
    const request: ApplePayPaymentRequest = {
      countryCode: "FR",
      currencyCode: "EUR",
      supportedNetworks: ["visa", "masterCard", "amex", "maestro", "cartesBancaires"],
      merchantCapabilities: ["supports3DS"],
      total: {
        label: checkoutItems.length === 1 ? checkoutItems[0].name : (t("cart.summary") as string),
        amount: total.toFixed(2),
      },
    }
    const AP = (window as unknown as { ApplePaySession: new (v: number, r: ApplePayPaymentRequest) => ApplePaySessionType }).ApplePaySession
    const session = new AP(3, request)
    session.onvalidatemerchant = async (event: { validationURL: string }) => {
      try {
        const res = await fetch("/api/checkout/apple-pay-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ validationUrl: event.validationURL }),
        })
        const merchantSession = await res.json()
        if (!res.ok) throw new Error(merchantSession.error ?? "Validation échouée")
        session.completeMerchantValidation(merchantSession)
      } catch (err) {
        session.abort()
        setPayError(err instanceof Error ? err.message : "Apple Pay indisponible")
        setApplePayLoading(false)
      }
    }
    session.onpaymentauthorized = async (event: { payment: { token: unknown } }) => {
      try {
        const tokenString = JSON.stringify(event.payment.token)
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: checkoutItems,
            discountAmount,
            applePayPaymentToken: tokenString,
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
        if (!res.ok) {
          session.completePayment(1)
          throw new Error(data.error ?? (t("cart.checkoutError") as string))
        }
        if (data.url) {
          session.completePayment(0)
          // Redirection différée pour que le sheet Apple Pay se ferme avant le redirect
          setTimeout(() => {
            window.location.assign(data.url)
          }, 100)
          return
        }
        session.completePayment(1)
        throw new Error(t("cart.checkoutError") as string)
      } catch (err) {
        session.completePayment(1)
        setPayError(err instanceof Error ? err.message : (t("cart.checkoutError") as string))
        setApplePayLoading(false)
      }
    }
    session.oncancel = () => setApplePayLoading(false)
    session.begin()
  }

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
      const msg = err instanceof Error ? err.message : (t("cart.checkoutError") as string)
      const isProfileNotFound = /profile\s+.*\s+not\s+found/i.test(msg)
      setPayError(
        isProfileNotFound ? `${msg} ${t("checkout.profileNotFoundHint") as string}` : msg
      )
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

  const checkoutReady = !profileId || mollieMounted || scriptError || mollieError

  return (
    <>
      <Script
        src="https://js.mollie.com/v1/mollie.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setScriptError(true)}
      />

      {/* Overlay : la page checkout ne s'affiche que quand tout est prêt */}
      {!checkoutReady && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen bg-white"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" aria-hidden />
          <p className="text-neutral-600 font-medium">
            {t("checkout.loading") as string}
          </p>
        </div>
      )}

      <div className="min-h-full flex flex-col w-full lg:h-full">
        <main className="w-full flex flex-col min-h-0 lg:flex-1 lg:min-h-0">
          {/* Contenu pleine page : scroll sur mobile, pleine hauteur sur desktop */}
          <div className="bg-white flex flex-col min-h-0 w-full lg:flex-1 lg:min-h-0 lg:overflow-hidden">
              <div className="flex-shrink-0 flex items-center justify-center py-5 px-6 border-b border-neutral-200">
                <Image
                  src="/images/logo.png"
                  alt={t("common.brandName") as string}
                  width={160}
                  height={48}
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-0 lg:flex-1">
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
                      <li key={`${item.productId}-${idx}`} className="flex gap-4">
                        <div className="relative h-24 w-24 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="96px"
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
                      {applePayAvailable && (
                        <>
                          <button
                            type="button"
                            onClick={handleApplePay}
                            disabled={applePayLoading || payLoading}
                            className="w-full min-h-[50px] sm:min-h-[52px] py-3 px-4 rounded-[10px] border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              WebkitAppearance: "-apple-pay-button",
                              appearance: "-apple-pay-button" as React.CSSProperties["appearance"],
                              borderRadius: "10px",
                            }}
                            aria-label={t("cart.payWithApplePay") as string}
                          />
                          <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-neutral-200" />
                            <span className="text-sm text-neutral-500">Ou</span>
                            <div className="flex-1 h-px bg-neutral-200" />
                          </div>
                        </>
                      )}
                      {profileId ? (
                        <div
                          ref={(el) => {
                            (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el
                            setContainerReady(!!el)
                          }}
                          className="checkout-mollie-card rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 min-h-[200px] sm:min-h-[220px] relative space-y-4"
                        >
                          {scriptError && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-neutral-100 p-6 text-center z-10">
                              <p className="text-sm text-red-600">Impossible de charger le formulaire de paiement.</p>
                            </div>
                          )}
                          {!scriptError && mollieError && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-neutral-100 p-6 text-center z-10">
                              <p className="text-sm text-red-600">{mollieError}</p>
                            </div>
                          )}
                          <div className="space-y-1.5" ref={cardNumberWrapRef}>
                            <label className="text-xs font-medium text-neutral-500 block" htmlFor="mollie-card-number">
                              {t("checkout.placeholderCardNumber") as string}
                            </label>
                            <div className="relative min-h-[44px]">
                              {showCardNumberHint && (
                                <span
                                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[15px] text-neutral-400"
                                  aria-hidden
                                >
                                  1234 5678 9012 3456
                                </span>
                              )}
                              <div data-mollie="cardNumber" id="mollie-card-number" className="min-h-[44px] rounded-lg border border-neutral-200 bg-white" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-500 block" htmlFor="mollie-card-holder">
                              {t("checkout.placeholderCardHolder") as string}
                            </label>
                            <div data-mollie="cardHolder" id="mollie-card-holder" className="min-h-[44px] rounded-lg border border-neutral-200 bg-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-neutral-500 block" htmlFor="mollie-expiry">
                                {t("checkout.placeholderExpiry") as string}
                              </label>
                              <div data-mollie="expiryDate" id="mollie-expiry" className="min-h-[44px] rounded-lg border border-neutral-200 bg-white" />
                            </div>
                            <div className="space-y-1.5" ref={cvcWrapRef}>
                              <label className="text-xs font-medium text-neutral-500 block" htmlFor="mollie-cvc">
                                {t("checkout.placeholderCvc") as string}
                              </label>
                              <div className="relative min-h-[44px]">
                                {showCvcHint && (
                                  <span
                                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[15px] text-neutral-400"
                                    aria-hidden
                                  >
                                    123
                                  </span>
                                )}
                                <div data-mollie="verificationCode" id="mollie-cvc" className="min-h-[44px] rounded-lg border border-neutral-200 bg-white" />
                              </div>
                            </div>
                          </div>
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

                      {/* Réassurance */}
                      <div className="mt-6 pt-5 border-t border-neutral-100 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Lock className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                          <span>{t("checkout.reassuranceSecure") as string}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                          <span>{t("checkout.reassuranceGuarantee") as string}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Package className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                          <span>{t("checkout.reassuranceDelivery") as string}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <CreditCard className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                          <span>{t("checkout.reassuranceCards") as string}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Shield className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                          <span>{t("checkout.reassuranceSsl") as string}</span>
                        </div>
                      </div>
                    </form>
                  </div>
                  <p className="mt-6 pt-5 border-t border-neutral-100 text-xs text-neutral-400">
                    {t("checkout.securePaymentByMollie") as string}{" "}
                    <span className="font-medium text-neutral-500">Mollie</span>
                  </p>
                </div>
              </div>
            </div>
        </main>
      </div>
    </>
  )
}
