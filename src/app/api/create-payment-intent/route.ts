import { NextResponse } from "next/server"
import Stripe from "stripe"

export interface PaymentIntentItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface CreatePaymentIntentBody {
  items: PaymentIntentItem[]
  discountAmount?: number
}

export async function POST(request: Request) {
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim()
  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "Stripe n'est pas configuré (STRIPE_SECRET_KEY manquant ou invalide)." },
      { status: 500 }
    )
  }

  const stripe = new Stripe(apiKey)

  let body: CreatePaymentIntentBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    )
  }

  const { items, discountAmount = 0 } = body

  if (!items?.length || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Le panier est vide." },
      { status: 400 }
    )
  }

  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0
  )
  const discountCents = Math.round(discountAmount * 100)
  const totalCents = Math.max(50, subtotalCents - discountCents)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    })
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
