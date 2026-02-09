import { NextResponse } from "next/server"
import createMollieClient from "@mollie/api-client"
import { getSupabaseAdmin } from "@/lib/supabase-server"

/** Normalise le numéro au format E.164 attendu par Mollie (+countryCode + chiffres, max 15). Retourne null si invalide. */
function normalizePhoneE164(phone: string, countryCode: string): string | null {
  const raw = String(phone).trim().replace(/\s/g, "")
  if (!raw) return null
  let digits = raw.replace(/\D/g, "")
  const withPlus = raw.startsWith("+")
  if (withPlus) {
    if (digits.length < 10 || digits.length > 15) return null
    return `+${digits}`
  }
  const countryDial: Record<string, string> = { FR: "33", BE: "32", NL: "31", DE: "49", ES: "34", IT: "39", LU: "352", CH: "41" }
  const dial = countryDial[countryCode.toUpperCase().slice(0, 2)] ?? "33"
  if (dial === "33" && digits.startsWith("0")) digits = digits.slice(1)
  if (dial === "32" && digits.startsWith("0")) digits = digits.slice(1)
  if (digits.length < 9 || digits.length > 12) return null
  const e164 = `+${dial}${digits}`
  if (e164.length > 16) return null
  return e164
}

export interface CheckoutItem {
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface ShippingAddress {
  givenName: string
  familyName: string
  email: string
  phone?: string
  streetAndNumber: string
  streetAdditional?: string
  postalCode: string
  city: string
  country: string
}

export interface CheckoutBody {
  items: CheckoutItem[]
  discountAmount?: number
  /** Token carte (Mollie Components) pour paiement intégré sur le site */
  cardToken?: string
  /** Token Apple Pay (JSON string) pour paiement Apple Pay */
  applePayPaymentToken?: string
  /** Adresse de livraison (étape avant paiement) */
  shippingAddress?: ShippingAddress
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

  const { items, discountAmount = 0, cardToken, applePayPaymentToken, shippingAddress } = body

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

  const baseParams: Record<string, unknown> = {
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

  if (shippingAddress && typeof shippingAddress === "object") {
    const { givenName, familyName, email, phone, streetAndNumber, streetAdditional, postalCode, city, country } = shippingAddress
    if (streetAndNumber && city && country) {
      const countryIso = String(country).trim().toUpperCase().slice(0, 2)
      const phoneE164 = phone ? normalizePhoneE164(phone, countryIso) : null
      baseParams.shippingAddress = {
        ...(givenName && { givenName }),
        ...(familyName && { familyName }),
        ...(email && { email }),
        ...(phoneE164 && { phone: phoneE164 }),
        streetAndNumber: String(streetAndNumber).trim(),
        ...(streetAdditional && { streetAdditional: String(streetAdditional).trim() }),
        ...(postalCode && { postalCode: String(postalCode).trim() }),
        city: String(city).trim(),
        country: countryIso,
      }
    }
  }

  let createParams: Record<string, unknown> = baseParams
  if (applePayPaymentToken && typeof applePayPaymentToken === "string" && applePayPaymentToken.trim()) {
    createParams = { ...baseParams, method: "applepay", applePayPaymentToken: applePayPaymentToken.trim() }
  } else if (cardToken && typeof cardToken === "string" && cardToken.trim()) {
    createParams = { ...baseParams, method: "creditcard", cardToken: cardToken.trim() }
  }

  try {
    const payment = await mollieClient.payments.create(
      createParams as unknown as Parameters<typeof mollieClient.payments.create>[0]
    )

    const checkoutUrl = payment.getCheckoutUrl()
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Mollie n'a pas renvoyé d'URL de paiement." },
        { status: 500 }
      )
    }

    // Enregistrer la commande en base (Supabase) pour suivi
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = getSupabaseAdmin()
        const totalCents = Math.round(total * 100)
        const orderPayload = {
          payment_id: payment.id,
          status: "pending",
          email: shippingAddress && typeof shippingAddress === "object" ? shippingAddress.email ?? null : null,
          shipping_address:
            shippingAddress && typeof shippingAddress === "object"
              ? {
                  givenName: shippingAddress.givenName,
                  familyName: shippingAddress.familyName,
                  email: shippingAddress.email,
                  phone: shippingAddress.phone,
                  streetAndNumber: shippingAddress.streetAndNumber,
                  streetAdditional: shippingAddress.streetAdditional,
                  postalCode: shippingAddress.postalCode,
                  city: shippingAddress.city,
                  country: shippingAddress.country,
                }
              : null,
          total_cents: totalCents,
          currency: "EUR",
          metadata: { itemCount: items.length, discount: discountAmount },
        }
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert(orderPayload)
          .select("id")
          .single()

        if (orderError || !order?.id) {
          console.error("[checkout] Supabase order insert:", orderError)
          return NextResponse.json(
            { error: "Impossible d'enregistrer la commande." },
            { status: 500 }
          )
        }

        const orderItemsPayload = items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          variant_id: item.variantId,
          name: item.name,
          image_url: item.image || null,
          unit_price: item.price,
          quantity: item.quantity,
        }))
        const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload)
        if (itemsError) {
          console.error("[checkout] Supabase order_items insert:", itemsError)
          return NextResponse.json(
            { error: "Impossible d'enregistrer le détail de la commande." },
            { status: 500 }
          )
        }
      } catch (supabaseErr) {
        console.error("[checkout] Supabase:", supabaseErr)
        return NextResponse.json(
          { error: "Erreur lors de l'enregistrement de la commande." },
          { status: 500 }
        )
      }
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
