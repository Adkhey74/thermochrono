"use client"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const returnUrl = `${baseUrl}/checkout/return`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsLoading(true)
    setErrorMessage(null)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    })
    if (error) {
      setErrorMessage(error.message ?? (t("checkout.errorCreating") as string))
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <Button
        type="submit"
        className="w-full min-h-[48px]"
        size="lg"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? (t("cart.checkoutLoading") as string) : (t("checkout.payButton") as string)}
      </Button>
    </form>
  )
}
