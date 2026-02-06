import { NextResponse } from "next/server"
import Stripe from "stripe"

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

  const { items, discountAmount = 0 } = body

  if (!items?.length || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Le panier est vide." },
      { status: 400 }
    )
  }

  function toAbsoluteImageUrl(path: string): string {
    if (!path?.trim()) return ""
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path
    }
    const pathNormalized = path.startsWith("/") ? path : `/${path}`
    return encodeURI(`${baseUrl}${pathNormalized}`)
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item: CheckoutItem) => {
      const unitAmount = Math.round(item.price * 100)
      if (unitAmount < 50) {
        throw new Error(`Montant invalide pour ${item.name}.`)
      }
      const imageUrl = toAbsoluteImageUrl(item.image)
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: imageUrl ? [imageUrl] : undefined,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      }
    }
  )

  const successUrl = `${baseUrl}/commande/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${baseUrl}/commande/annulee`

  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: "fr",
    }

    if (discountAmount > 0) {
      const discountInCents = Math.round(discountAmount * 100)
      const coupon = await stripe.coupons.create({
        amount_off: discountInCents,
        currency: "eur",
        duration: "once",
        name: "Réduction promo",
      })
      params.discounts = [{ coupon: coupon.id }]
    }

    const session = await stripe.checkout.sessions.create(params)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
