import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

/**
 * Client Supabase côté serveur (API routes, server components).
 * Utilise la clé service_role pour contourner la RLS et écrire dans orders / order_items.
 * À n'utiliser que côté serveur, jamais exposée au client.
 */
export function getSupabaseAdmin() {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase non configuré : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis."
    )
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

export type SupabaseAdmin = ReturnType<typeof getSupabaseAdmin>
