export type PromoType = "percent" | "fixed"

export interface PromoCode {
  code: string
  type: PromoType
  value: number
  label?: string
}

/** Codes promo valides (en majuscules pour comparaison insensible à la casse) */
export const PROMO_CODES: PromoCode[] = [
  { code: "THERMO10", type: "percent", value: 10, label: "−10%" },
  { code: "PROMO50", type: "percent", value: 50, label: "−50%" },
  { code: "BIENVENUE", type: "fixed", value: 5, label: "−5 €" },
]

export function getPromoByCode(input: string): PromoCode | null {
  const normalized = input.trim().toUpperCase()
  return PROMO_CODES.find((p) => p.code === normalized) ?? null
}

export function applyPromo(subtotal: number, promo: PromoCode): number {
  if (promo.type === "percent") {
    return Math.round((subtotal * (promo.value / 100)) * 100) / 100
  }
  return Math.min(promo.value, subtotal)
}
