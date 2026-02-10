/**
 * Envoi d'emails transactionnels via l'API Brevo.
 * Variable d'environnement : BREVO_API_KEY
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

export interface BrevoSender {
  email: string
  name: string
}

export interface BrevoRecipient {
  email: string
  name?: string
}

export interface SendEmailParams {
  sender: BrevoSender
  to: BrevoRecipient[]
  subject: string
  htmlContent: string
  replyTo?: BrevoSender
}

/**
 * Envoie un email via l'API Brevo.
 * @throws Error si la clé API est absente ou si l'API renvoie une erreur
 */
export async function sendBrevoEmail(params: SendEmailParams): Promise<{ messageId: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  if (!apiKey) {
    throw new Error("BREVO_API_KEY n'est pas configuré.")
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: params.sender,
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      ...(params.replyTo && { replyTo: params.replyTo }),
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Brevo API ${res.status}: ${errBody}`)
  }

  const data = (await res.json()) as { messageId?: string }
  return { messageId: data.messageId ?? "" }
}
