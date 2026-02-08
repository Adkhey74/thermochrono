import { NextResponse } from "next/server"
import createMollieClient from "@mollie/api-client"

export interface CheckoutItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface CheckoutBody {
  items: CheckoutItem[]
  discountAmount?: number
  /** Token carte (Mollie Components) pour paiement intégré sur le site */
  cardToken?: string
}

export async function POST(request: Request) {
  const apiKey = process.env.MOLLIE_API_KEY?.trim()
  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "Mollie n'est pas configuré (MOLLIE_API_KEY manquant ou invalide)." },
      { status: 500 }
    )
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").trim().replace(/\/$/, "")

  try {
    new URL(baseUrl)
  } catch {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL n'est pas une URL valide." },
      { status: 500 }
    )
  }

  let body: CheckoutBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    )
  }

  const { items, discountAmount = 0, cardToken } = body

  if (!items?.length || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Le panier est vide." },
      { status: 400 }
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = Math.max(0.01, subtotal - discountAmount)
  const amountStr = total.toFixed(2)

  const mollieClient = createMollieClient({ apiKey })

  const description =
    items.length === 1
      ? items[0].name
      : `Commande ${items.length} articles`

  const baseParams = {
    amount: {
      value: amountStr,
      currency: "EUR",
    },
    description,
    redirectUrl: `${baseUrl}/commande/success`,
    webhookUrl: `${baseUrl}/api/webhooks/mollie`,
    metadata: {
      itemCount: String(items.length),
      discount: String(discountAmount),
    },
  }

  const createParams =
    cardToken && typeof cardToken === "string" && cardToken.trim()
      ? { ...baseParams, method: "creditcard", cardToken: cardToken.trim() }
      : baseParams

  try {
    const payment = await mollieClient.payments.create(
      createParams as Parameters<typeof mollieClient.payments.create>[0]
    )

    const checkoutUrl = payment.getCheckoutUrl()
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Mollie n'a pas renvoyé d'URL de paiement." },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: checkoutUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Mollie"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** Récupère les infos d'un paiement Mollie (pour la page succès). */
export async function GET(request: Request) {
  const apiKey = process.env.MOLLIE_API_KEY?.trim()
  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "Mollie n'est pas configuré." },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get("payment_id")?.trim() || searchParams.get("id")?.trim()
  if (!paymentId) {
    return NextResponse.json(
      { error: "payment_id manquant." },
      { status: 400 }
    )
  }

  const mollieClient = createMollieClient({ apiKey })

  try {
    const payment = await mollieClient.payments.get(paymentId)

    if (payment.status !== "paid") {
      return NextResponse.json(
        { error: "Paiement non abouti." },
        { status: 400 }
      )
    }

    const details = payment.details as Record<string, unknown> | undefined
    const shippingAddress = payment.shippingAddress as { streetAndNumber?: string; city?: string; postalCode?: string; country?: string } | undefined

    const address = shippingAddress
      ? {
          line1: shippingAddress.streetAndNumber ?? null,
          line2: null,
          city: shippingAddress.city ?? null,
          postal_code: shippingAddress.postalCode ?? null,
          country: shippingAddress.country ?? null,
        }
      : null

    return NextResponse.json({
      email: (details?.consumerAccount as string | undefined) ?? null,
      phone: null,
      name: (details?.consumerName as string | undefined) ?? null,
      address,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Mollie"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
