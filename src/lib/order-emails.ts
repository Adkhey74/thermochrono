/**
 * Contenu des emails commande : récap client et détail entreprise (Brevo).
 */

export interface ShippingAddressData {
  givenName?: string
  familyName?: string
  email?: string
  phone?: string
  streetAndNumber?: string
  streetAdditional?: string
  postalCode?: string
  city?: string
  country?: string
}

export interface OrderForEmail {
  id: string
  email: string | null
  shipping_address: ShippingAddressData | null
  total_cents: number
  currency: string
}

export interface OrderItemForEmail {
  name: string
  unit_price: number
  quantity: number
}

const SITE_NAME = "Thermo Chrono"
const COMPANY_EMAIL = "thermo.chronoo@gmail.com"

function formatAmount(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`
}

/** Email récap pour le client */
export function buildOrderEmailClient(order: OrderForEmail, items: OrderItemForEmail[]): string {
  const total = formatAmount(order.total_cents, order.currency)
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${item.unit_price.toFixed(2)} €</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${(item.unit_price * item.quantity).toFixed(2)} €</td>
        </tr>`
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f766e 0%,#0d9488 100%);padding:24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;">${escapeHtml(SITE_NAME)}</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Confirmation de commande</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 20px;color:#374151;font-size:15px;">Bonjour,</p>
      <p style="margin:0 0 20px;color:#374151;font-size:15px;">Merci pour votre commande. Voici le récapitulatif :</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Article</th>
            <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Qté</th>
            <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">Prix unit.</th>
            <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:16px 0 0;font-size:16px;font-weight:600;color:#0f766e;">Total : ${total}</p>
      <p style="margin:24px 0 0;color:#6b7280;font-size:13px;">Livraison sous 7 à 10 jours. Paiement sécurisé enregistré.</p>
      <p style="margin:16px 0 0;color:#374151;font-size:15px;">À bientôt,<br/><strong>${escapeHtml(SITE_NAME)}</strong></p>
    </div>
  </div>
</body>
</html>`
}

/** Email pour l'entreprise : commande + infos client */
export function buildOrderEmailCompany(order: OrderForEmail, items: OrderItemForEmail[]): string {
  const total = formatAmount(order.total_cents, order.currency)
  const addr = order.shipping_address
  const clientName = addr ? [addr.givenName, addr.familyName].filter(Boolean).join(" ") || "—" : "—"
  const clientEmail = order.email || addr?.email || "—"
  const clientPhone = addr?.phone || "—"
  const addressLines = addr
    ? [
        addr.streetAndNumber,
        addr.streetAdditional,
        [addr.postalCode, addr.city].filter(Boolean).join(" "),
        addr.country,
      ].filter(Boolean)
    : ["—"]

  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;">${(item.unit_price * item.quantity).toFixed(2)} €</td>
        </tr>`
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="background:#1f2937;padding:20px;">
      <h1 style="margin:0;color:#fff;font-size:18px;">Nouvelle commande — ${escapeHtml(SITE_NAME)}</h1>
      <p style="margin:6px 0 0;color:#9ca3af;font-size:13px;">Commande #${escapeHtml(String(order.id).slice(0, 8))}</p>
    </div>
    <div style="padding:20px;">
      <h2 style="margin:0 0 12px;font-size:14px;color:#6b7280;text-transform:uppercase;">Client</h2>
      <p style="margin:0 0 4px;font-size:14px;"><strong>${escapeHtml(clientName)}</strong></p>
      <p style="margin:0 0 4px;font-size:14px;">Email : ${escapeHtml(clientEmail)}</p>
      <p style="margin:0 0 12px;font-size:14px;">Tél : ${escapeHtml(clientPhone)}</p>
      <p style="margin:0 0 20px;font-size:14px;color:#374151;">Adresse livraison :<br/>${addressLines.map((l) => escapeHtml(l ?? "")).join("<br/>")}</p>
      <h2 style="margin:0 0 12px;font-size:14px;color:#6b7280;text-transform:uppercase;">Détail commande</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 10px;text-align:left;border-bottom:2px solid #e5e7eb;">Article</th>
            <th style="padding:8px 10px;text-align:center;border-bottom:2px solid #e5e7eb;">Qté</th>
            <th style="padding:8px 10px;text-align:right;border-bottom:2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:12px 0 0;font-weight:600;">Total : ${total}</p>
    </div>
  </div>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export const ORDER_EMAIL = {
  sender: { email: COMPANY_EMAIL, name: SITE_NAME } as const,
  companyInbox: COMPANY_EMAIL,
  clientSubject: "Confirmation de commande — Thermo Chrono",
  companySubject: "Nouvelle commande Thermo Chrono",
}
