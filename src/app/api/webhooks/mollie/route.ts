import { NextResponse } from "next/server"
import createMollieClient from "@mollie/api-client"
import { getSupabaseAdmin } from "@/lib/supabase-server"
import { sendBrevoEmail } from "@/lib/brevo"
import {
  buildOrderEmailClient,
  buildOrderEmailCompany,
  ORDER_EMAIL,
  type OrderForEmail,
  type OrderItemForEmail,
} from "@/lib/order-emails"

/**
 * Webhook Mollie : Mollie envoie une requête POST (body application/x-www-form-urlencoded : id=tr_xxx)
 * quand le statut du paiement change. Répondre 200 pour confirmer la réception.
 *
 * L’URL du webhook doit être joignable depuis Internet. En local : utiliser un tunnel
 * (ex. ngrok http 3000) et configurer dans Mollie l’URL https://xxx.ngrok.io/api/webhooks/mollie
 */
export async function POST(request: Request) {
  const apiKey = process.env.MOLLIE_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 })
  }

  try {
    const contentType = request.headers.get("content-type") ?? ""
    let paymentId: string | null = null
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData()
      const id = form.get("id")
      paymentId = typeof id === "string" ? id.trim() || null : null
    } else {
      const body = await request.json().catch(() => ({}))
      paymentId = typeof (body as { id?: unknown })?.id === "string" ? (body as { id: string }).id : null
    }
    if (!paymentId) {
      return NextResponse.json({ error: "id manquant" }, { status: 400 })
    }

    const mollie = createMollieClient({ apiKey })
    const payment = await mollie.payments.get(paymentId)

    if (payment.status === "paid") {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
      if (supabaseUrl && supabaseServiceKey) {
        try {
          const supabase = getSupabaseAdmin()
          await supabase
            .from("orders")
            .update({ status: "paid", updated_at: new Date().toISOString() })
            .eq("payment_id", paymentId)

          // Récupérer la commande et les lignes pour les emails
          const { data: order } = await supabase
            .from("orders")
            .select("id, email, shipping_address, total_cents, currency")
            .eq("payment_id", paymentId)
            .single()

          if (order) {
            const { data: orderItems } = await supabase
              .from("order_items")
              .select("name, unit_price, quantity")
              .eq("order_id", order.id)

            const items: OrderItemForEmail[] = (orderItems ?? []).map((row) => ({
              name: row.name,
              unit_price: Number(row.unit_price),
              quantity: row.quantity,
            }))
            const orderForEmail: OrderForEmail = {
              id: order.id,
              email: order.email ?? null,
              shipping_address: order.shipping_address as OrderForEmail["shipping_address"],
              total_cents: order.total_cents ?? 0,
              currency: order.currency ?? "EUR",
            }

            const brevoKey = process.env.BREVO_API_KEY?.trim()
            if (brevoKey) {
              const clientEmail = orderForEmail.email || (orderForEmail.shipping_address?.email as string) || null
              if (clientEmail) {
                try {
                  await sendBrevoEmail({
                    sender: ORDER_EMAIL.sender,
                    to: [{ email: clientEmail }],
                    subject: ORDER_EMAIL.clientSubject,
                    htmlContent: buildOrderEmailClient(orderForEmail, items),
                    replyTo: { email: ORDER_EMAIL.companyInbox, name: "Thermo Chrono" },
                  })
                } catch (err) {
                  console.error("[webhook mollie] Brevo email client:", err)
                }
              }
              try {
                await sendBrevoEmail({
                  sender: ORDER_EMAIL.sender,
                  to: [{ email: ORDER_EMAIL.companyInbox, name: "Thermo Chrono" }],
                  subject: ORDER_EMAIL.companySubject,
                  htmlContent: buildOrderEmailCompany(orderForEmail, items),
                })
              } catch (err) {
                console.error("[webhook mollie] Brevo email company:", err)
              }
            }
          }
        } catch (err) {
          console.error("[webhook mollie] Supabase:", err)
        }
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 })
  }
}

/** GET : pour vérifier que l’URL est joignable (ex. après avoir lancé ngrok). */
export async function GET() {
  return NextResponse.json({ ok: true, webhook: "mollie" }, { status: 200 })
}
