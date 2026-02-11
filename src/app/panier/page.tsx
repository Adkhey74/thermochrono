"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Shield, Truck, Lock, Tag } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { ProductCard } from "@/components/ProductCard"
import { PaymentMethods } from "@/components/PaymentMethods"
import { product, getProductById, getVariant } from "@/data/products"
import { ChevronRight } from "lucide-react"
import { getPromoByCode, applyPromo, type PromoCode } from "@/lib/promo-codes"
import { getProductDisplay } from "@/lib/i18n/product-display"
import { getShippingFee } from "@/lib/shipping"

const CHECKOUT_DISCOUNT_KEY = "checkoutDiscount"

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore()
  const { t } = useI18n()
  const [promoInput, setPromoInput] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const subtotal = totalPrice()
  const discount = appliedPromo ? applyPromo(subtotal, appliedPromo) : 0
  const orderAmount = Math.max(0, subtotal - discount)
  const shippingFee = getShippingFee(orderAmount)
  const finalTotal = orderAmount + shippingFee

  const handleApplyPromo = () => {
    setPromoError(null)
    const promo = getPromoByCode(promoInput)
    if (promo) {
      setAppliedPromo(promo)
      setPromoInput("")
    } else {
      setAppliedPromo(null)
      setPromoError(t("cart.promoInvalid") as string)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoError(null)
  }

  const handleCheckout = () => {
    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      sessionStorage.setItem(CHECKOUT_DISCOUNT_KEY, JSON.stringify({ discount }))
      router.push("/panier/livraison")
    } catch {
      setCheckoutError(t("cart.checkoutError") as string)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <nav className="mb-6 sm:mb-8 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap" aria-label={t("common.breadcrumbAria") as string}>
            <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors duration-200 ease-out touch-manipulation">{t("header.home") as string}</Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-foreground font-medium">{t("cart.title") as string}</span>
          </nav>
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <span className="text-4xl" aria-hidden>🛒</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{t("cart.empty") as string}</h1>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">{t("cart.emptyHint") as string}</p>
            <Button asChild size="lg" className="min-h-[48px] touch-manipulation">
              <Link href="/boutique">{t("cart.viewProducts") as string}</Link>
            </Button>
          </div>
          <section className="mt-12 sm:mt-16">
            <h2 className="text-lg font-semibold mb-6">{t("cart.youMightLikeEmpty") as string}</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {product.variants.slice(0, 3).map((v) => (
                <div key={v.id} className="w-full sm:w-[280px]">
                  <ProductCard product={product} variant={v} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  const inCartVariantIds = new Set(items.map((i) => `${i.productId}:${i.variantId}`))
  const suggested = product.variants
    .filter((v) => !inCartVariantIds.has(`${product.id}:${v.id}`))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <nav className="mb-6 sm:mb-8 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap" aria-label={t("common.breadcrumbAria") as string}>
          <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors duration-200 ease-out touch-manipulation">{t("header.home") as string}</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-foreground font-medium">{t("cart.title") as string}</span>
        </nav>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("cart.title") as string}</h1>
          <p className="mt-1 text-muted-foreground">
            {totalItems() > 1
              ? (t("cart.itemsInCart") as string).replace("{count}", String(totalItems()))
              : (t("cart.itemInCart") as string)}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ul className="space-y-4">
              {items.map((item) => {
                const p = getProductById(item.productId)
                const v = p && getVariant(p, item.variantId)
                if (!p || !v) return null
                const display = getProductDisplay(p, t, v)
                const displayName = display.color ? `${display.name} — ${display.color}` : display.name
                const imageSrc = v.images?.[0]
                return (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
                  >
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-muted/20 self-center sm:self-auto">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={displayName}
                          fill
                          className="object-cover object-center"
                          sizes="112px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">{displayName}</h2>
                        <p className="mt-2 text-muted-foreground" aria-label={`${t("cart.unitPriceQuantity") as string} : ${v.price.toFixed(2)} € × ${item.quantity} = ${(v.price * item.quantity).toFixed(2)} €`}>
                          <span className="block text-xs text-muted-foreground/80 mb-0.5">{t("cart.unitPriceQuantity") as string}</span>
                          <span className="text-sm">
                            {v.price.toFixed(2)} € × {item.quantity} ={" "}
                            <span className="font-semibold text-foreground">
                              {(v.price * item.quantity).toFixed(2)} €
                            </span>
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center text-sm font-medium hover:bg-muted transition-colors"
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-sm font-medium hover:bg-muted transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold">{t("cart.summary") as string}</h2>

              <div className="space-y-2">
                <p className="flex justify-between text-muted-foreground">
                  <span>{appliedPromo ? (t("cart.subtotal") as string) : `${t("cart.items") as string} (${totalItems()})`}</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </p>
                {appliedPromo && (
                  <p className="flex justify-between text-green-600 text-sm">
                    <span>{t("cart.discount") as string} ({appliedPromo.code})</span>
                    <span>−{discount.toFixed(2)} €</span>
                  </p>
                )}
                {shippingFee > 0 ? (
                  <p className="flex justify-between text-muted-foreground text-sm">
                    <span>{t("cart.shippingFee") as string}</span>
                    <span>{shippingFee.toFixed(2)} €</span>
                  </p>
                ) : (
                  <p className="flex justify-between text-green-600 text-sm">
                    <span>{t("cart.freeShippingFrom") as string}</span>
                    <span>0,00 €</span>
                  </p>
                )}
                <p className="flex justify-between pt-2 border-t border-border font-semibold text-base">
                  <span>{t("cart.total") as string}</span>
                  <span className="text-primary">{finalTotal.toFixed(2)} €</span>
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3" role="group" aria-labelledby="promo-heading">
                <p id="promo-heading" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" aria-hidden />
                  {t("cart.promoCode") as string}
                </p>
                {appliedPromo ? (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm">
                    <span className="font-medium text-green-700">
                      {appliedPromo.code} {appliedPromo.label && `— ${appliedPromo.label}`}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:underline font-medium"
                    >
                      {t("cart.removePromo") as string}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        id="promo-code"
                        type="text"
                        placeholder={t("cart.promoPlaceholder") as string}
                        aria-label={t("cart.promoCode") as string}
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value)
                          setPromoError(null)
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                        className="flex-1 h-10 uppercase"
                        aria-invalid={!!promoError}
                        aria-describedby={promoError ? "promo-error" : undefined}
                      />
                      <Button type="button" variant="secondary" onClick={handleApplyPromo} className="shrink-0 h-10 px-4">
                        {t("cart.promoApply") as string}
                      </Button>
                    </div>
                    {promoError && (
                      <p id="promo-error" className="text-sm text-destructive" role="alert">
                        {promoError}
                      </p>
                    )}
                  </>
                )}
              </div>
              {checkoutError && (
                <p className="text-sm text-destructive" role="alert">
                  {checkoutError}
                </p>
              )}

              <Button
                className="w-full min-h-[48px] touch-manipulation"
                size="lg"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (t("cart.checkoutLoading") as string) : (t("cart.checkout") as string)}
              </Button>
              <Button variant="outline" className="w-full min-h-[48px] touch-manipulation" asChild>
                <Link href="/">{t("cart.continueShopping") as string}</Link>
              </Button>
              <div className="pt-4 border-t border-border space-y-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  {t("cart.securePayment") as string}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 shrink-0" />
                  {t("cart.fastDelivery") as string}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 shrink-0" />
                  {t("cart.satisfaction") as string}
                </p>
              </div>
              <PaymentMethods className="pt-4 border-t border-border" height={20} />
            </div>
          </div>
        </div>

        {suggested.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-border/60">
            <h2 className="text-lg font-semibold mb-6">{t("cart.youMightLike") as string}</h2>
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
              {suggested.map((v) => (
                <div key={v.id} className="min-w-[calc(50%-0.5rem)] sm:min-w-0 w-full sm:w-[280px] lg:w-[260px] flex-shrink-0 sm:flex-shrink">
                  <ProductCard product={product} variant={v} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
