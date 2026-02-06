"use client"

import { useEffect, useRef, useState } from "react"
import { useStripe } from "@stripe/react-stripe-js"
import { useI18n } from "@/lib/i18n/context"
import { useCartStore } from "@/store/cart-store"
import { Apple } from "lucide-react"

interface ApplePayButtonProps {
  clientSecret: string
  amountInCents: number
}

export function ApplePayButton({ clientSecret, amountInCents }: ApplePayButtonProps) {
  const stripe = useStripe()
  const { t } = useI18n()
  const clearCart = useCartStore((s) => s.clearCart)
  const [showButton, setShowButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const paymentRequestRef = useRef<{ show: () => void | Promise<unknown> } | null>(null)

  useEffect(() => {
    if (!stripe || !clientSecret || amountInCents < 50) return

    const pr = stripe.paymentRequest({
      country: "FR",
      currency: "eur",
      total: {
        label: "Thermo Chrono",
        amount: amountInCents,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    pr.on("paymentmethod", async (ev) => {
      if (!stripe) {
        ev.complete("fail")
        return
      }
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      })
      if (confirmError) {
        setError(confirmError.message ?? null)
        ev.complete("fail")
        setIsLoading(false)
        return
      }
      ev.complete("success")
      clearCart()
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("checkoutDiscount")
        window.location.href = "/commande/success"
      }
    })

    pr.canMakePayment()
      .then((result) => {
        if (result?.applePay) {
          paymentRequestRef.current = pr as { show: () => void | Promise<unknown> }
          setShowButton(true)
        }
      })
      .catch(() => {})

    return () => {
      paymentRequestRef.current = null
      setShowButton(false)
    }
  }, [stripe, clientSecret, amountInCents, clearCart])

  const handleClick = () => {
    const pr = paymentRequestRef.current
    if (!pr) return
    setError(null)
    setIsLoading(true)
    Promise.resolve(pr.show())
      .then(() => {})
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : (err as { message?: string })?.message
        setError(message ?? (t("checkout.errorCreating") as string))
        setIsLoading(false)
      })
  }

  if (!showButton) return null

  return (
    <div className="mb-6">
      {error && (
        <p className="text-sm text-destructive mb-2" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full min-h-[48px] touch-manipulation flex items-center justify-center gap-2 rounded-lg bg-black text-white font-medium text-base hover:bg-black/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
        aria-label={t("cart.payWithApplePay") as string}
      >
        <Apple className="h-5 w-5" />
        <span>
          {isLoading ? (t("cart.checkoutLoading") as string) : (t("cart.payWithApplePay") as string)}
        </span>
      </button>
    </div>
  )
}
