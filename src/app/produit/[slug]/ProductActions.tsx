"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import type { Product, ProductVariant } from "@/types/product"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { ShoppingCart, Zap } from "lucide-react"

interface ProductActionsProps {
  product: Product
  variant: ProductVariant
}

export function ProductActions({ product, variant }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { t } = useI18n()

  const handleAdd = () => addItem(product, variant)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 rounded-xl min-h-[48px] h-12 font-semibold gap-2 touch-manipulation"
          onClick={handleAdd}
        >
          <ShoppingCart className="h-5 w-5" />
          {t("product.addToCart") as string}
        </Button>
        <Button size="lg" className="flex-1 rounded-xl min-h-[48px] h-12 font-semibold gap-2 touch-manipulation" asChild>
          <Link href="/panier" onClick={handleAdd}>
            <Zap className="h-5 w-5" />
            {t("product.buyNow") as string}
          </Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground flex items-center justify-center gap-4 flex-wrap">
        <span>{t("trust.fastDelivery") as string}</span>
        <span>·</span>
        <span>{t("trust.securePayment") as string}</span>
      </p>
    </div>
  )
}
