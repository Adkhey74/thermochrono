"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart-store"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { loadShipping, saveShipping, type StoredShipping } from "@/lib/checkout-shipping"

const CHECKOUT_DISCOUNT_KEY = "checkoutDiscount"
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

export default function LivraisonPage() {
  const router = useRouter()
  const { items, totalPrice } = useCartStore()
  const { t } = useI18n()
  const [shipping, setShipping] = useState<StoredShipping>(defaultShipping)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    setShipping(loadShipping())
  }, [])
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CHECKOUT_DISCOUNT_KEY)
      if (raw) {
        const data = JSON.parse(raw) as { discount?: number }
        if (typeof data.discount === "number") setDiscount(data.discount)
      }
    } catch { /* ignore */ }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShippingError(null)
    const { firstName, lastName, email, streetAndNumber, postalCode, city, country } = shipping
    if (!firstName.trim()) {
      setShippingError((t("checkout.requiredField") as string) + " : " + (t("checkout.firstName") as string))
      return
    }
    if (!lastName.trim()) {
      setShippingError((t("checkout.requiredField") as string) + " : " + (t("checkout.lastName") as string))
      return
    }
    if (!email.trim()) {
      setShippingError((t("checkout.requiredField") as string) + " : " + (t("checkout.email") as string))
      return
    }
    if (!streetAndNumber.trim()) {
      setShippingError((t("checkout.requiredField") as string) + " : " + (t("checkout.address") as string))
      return
    }
    if (!postalCode.trim()) {
      setShippingError((t("checkout.requiredField") as string) + " : " + (t("checkout.postalCode") as string))
      return
    }
    if (!city.trim()) {
      setShippingError((t("checkout.requiredField") as string) + " : " + (t("checkout.city") as string))
      return
    }
    if (!country.trim()) {
      setShippingError((t("checkout.requiredField") as string) + " : " + (t("checkout.country") as string))
      return
    }
    setLoading(true)
    saveShipping(shipping)
    router.push("/checkout")
  }

  if (items.length === 0) {
    router.replace("/panier")
    return null
  }

  const subtotal = totalPrice()
  const total = Math.max(0, subtotal - discount)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-10 max-w-xl">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap" aria-label={t("common.breadcrumbAria") as string}>
          <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors">
            {t("header.home") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href="/panier" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors">
            {t("cart.title") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-foreground font-medium">{t("checkout.deliveryTitle") as string}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("checkout.deliveryTitle") as string}</h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} {items.length === 1 ? (t("cart.items") as string).toLowerCase() : (t("cart.items") as string).toLowerCase()} · <span className="font-semibold text-foreground">{total.toFixed(2)} €</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Coordonnées : 1 champ par ligne, ou 2 colonnes (prénom/nom) sur desktop */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-5 text-muted-foreground">
              {t("checkout.contactDetails") as string}
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="liv-firstName" className="block text-sm font-medium text-foreground">
                    {t("checkout.firstName") as string} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="liv-firstName"
                    value={shipping.firstName}
                    onChange={(e) => setShipping((s) => ({ ...s, firstName: e.target.value }))}
                    placeholder="Jean"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="liv-lastName" className="block text-sm font-medium text-foreground">
                    {t("checkout.lastName") as string} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="liv-lastName"
                    value={shipping.lastName}
                    onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))}
                    placeholder="Dupont"
                    className="h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="liv-email" className="block text-sm font-medium text-foreground">
                  {t("checkout.email") as string} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="liv-email"
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  placeholder="jean@exemple.fr"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="liv-phone" className="block text-sm font-medium text-foreground">
                  {t("checkout.phone") as string}
                </label>
                <Input
                  id="liv-phone"
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                  className="h-11"
                />
              </div>
            </div>
          </section>

          {/* Adresse : 1 champ par ligne, code postal + ville sur une ligne (2 colonnes) */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-5 text-muted-foreground">
              {t("checkout.deliveryAddressSection") as string}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="liv-streetAndNumber" className="block text-sm font-medium text-foreground">
                  {t("checkout.address") as string} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="liv-streetAndNumber"
                  value={shipping.streetAndNumber}
                  onChange={(e) => setShipping((s) => ({ ...s, streetAndNumber: e.target.value }))}
                  placeholder="12 rue de la Paix"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="liv-streetAdditional" className="block text-sm font-medium text-foreground">
                  {t("checkout.addressOptional") as string}
                </label>
                <Input
                  id="liv-streetAdditional"
                  value={shipping.streetAdditional}
                  onChange={(e) => setShipping((s) => ({ ...s, streetAdditional: e.target.value }))}
                  placeholder="Bâtiment, étage, code d’accès…"
                  className="h-11"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="liv-postalCode" className="block text-sm font-medium text-foreground">
                    {t("checkout.postalCode") as string} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="liv-postalCode"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                    placeholder="75001"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="liv-city" className="block text-sm font-medium text-foreground">
                    {t("checkout.city") as string} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="liv-city"
                    value={shipping.city}
                    onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    placeholder="Paris"
                    className="h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="liv-country" className="block text-sm font-medium text-foreground">
                  {t("checkout.country") as string} <span className="text-red-500">*</span>
                </label>
                <select
                  id="liv-country"
                  value={shipping.country}
                  onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="LU">Luxembourg</option>
                </select>
              </div>
            </div>
          </section>

          {shippingError && (
            <p className="text-sm text-red-600 rounded-lg bg-red-50 border border-red-100 px-4 py-3" role="alert">
              {shippingError}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="outline" asChild size="lg" className="min-h-[48px] sm:min-h-[52px] order-2 sm:order-1">
              <Link href="/panier">{t("cart.continueShopping") as string}</Link>
            </Button>
            <Button type="submit" size="lg" className="flex-1 min-h-[48px] sm:min-h-[52px] order-1 sm:order-2" disabled={loading}>
              {loading ? (t("cart.checkoutLoading") as string) : (t("checkout.continueToPayment") as string)}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
