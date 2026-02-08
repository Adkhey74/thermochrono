/**
 * Clé et helpers pour l’adresse de livraison stockée en session (avant checkout).
 */

export const CHECKOUT_SHIPPING_KEY = "checkoutShipping"

export type StoredShipping = {
  firstName: string
  lastName: string
  email: string
  phone: string
  streetAndNumber: string
  streetAdditional: string
  postalCode: string
  city: string
  country: string
}

const defaultShipping: StoredShipping = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAndNumber: "",
  streetAdditional: "",
  postalCode: "",
  city: "",
  country: "FR",
}

export function loadShipping(): StoredShipping {
  if (typeof window === "undefined") return defaultShipping
  try {
    const raw = sessionStorage.getItem(CHECKOUT_SHIPPING_KEY)
    if (!raw) return defaultShipping
    const data = JSON.parse(raw) as Partial<StoredShipping>
    return { ...defaultShipping, ...data }
  } catch {
    return defaultShipping
  }
}

export function saveShipping(s: StoredShipping) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(CHECKOUT_SHIPPING_KEY, JSON.stringify(s))
}

/** Retourne true si l’adresse a les champs requis remplis. */
export function hasValidShipping(s: StoredShipping): boolean {
  return (
    s.firstName.trim() !== "" &&
    s.lastName.trim() !== "" &&
    s.email.trim() !== "" &&
    s.streetAndNumber.trim() !== "" &&
    s.postalCode.trim() !== "" &&
    s.city.trim() !== "" &&
    s.country.trim() !== ""
  )
}
