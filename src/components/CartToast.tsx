"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product, ProductVariant } from "@/types/product"
import { ShoppingBag, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { getProductDisplay } from "@/lib/i18n/product-display"

interface CartToastContentProps {
  product: Product
  variant: ProductVariant
  quantity: number
}

export function CartToastContent({ product, variant, quantity }: CartToastContentProps) {
  const { t } = useI18n()
  const display = getProductDisplay(product, t, variant)
  const isPlural = quantity > 1
  const message = isPlural
    ? (t("cart.addedToCartPlural") as string).replace("{count}", String(quantity))
    : (t("cart.addedToCart") as string)
  const displayName = display.color ? `${display.name} — ${display.color}` : display.name
  const imageSrc = variant?.images?.[0]
  return (
    <div className="flex gap-4 w-full max-w-[340px] p-2 rounded-xl border border-border bg-card shadow-lg border-l-4 border-l-green-500">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-contain p-1"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-600">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          {message}
        </p>
        <p className="text-muted-foreground text-sm truncate">{displayName}</p>
        {isPlural && (
          <p className="text-xs text-muted-foreground">
            {variant.price.toFixed(2)} € × {quantity}
          </p>
        )}
      </div>
      <Link
        href="/panier"
        className="shrink-0 self-center inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 ease-out"
      >
        <ShoppingBag className="h-4 w-4" />
        {t("cart.cartButton") as string}
      </Link>
    </div>
  )
}
