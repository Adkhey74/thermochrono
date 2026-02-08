import { NextResponse } from "next/server"

/**
 * Valide le merchant Apple Pay via Mollie et retourne la session pour completeMerchantValidation.
 * À appeler depuis le client lors de l’événement validatemerchant.
 */
export async function POST(request: Request) {
  const apiKey = process.env.MOLLIE_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: "Mollie n'est pas configuré." },
      { status: 500 }
    )
  }

  let body: { validationUrl?: string; validationURL?: string; domain?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Corps invalide." },
      { status: 400 }
    )
  }

  const validationUrl = body.validationUrl ?? body.validationURL
  if (!validationUrl || typeof validationUrl !== "string") {
    return NextResponse.json(
      { error: "validationUrl manquant." },
      { status: 400 }
    )
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").trim().replace(/\/$/, "")
  let domain: string
  try {
    domain = new URL(baseUrl).hostname
  } catch {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL invalide." },
      { status: 500 }
    )
  }

  try {
    const res = await fetch("https://api.mollie.com/v2/wallets/applepay/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ validationUrl, domain }),
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail ?? data.title ?? "Erreur Mollie" },
        { status: res.status >= 500 ? 500 : 400 }
      )
    }
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Apple Pay"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
