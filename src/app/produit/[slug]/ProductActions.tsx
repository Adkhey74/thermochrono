"use client"

import { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import type { Product, ProductVariant } from "@/types/product"
import { Button } from "@/components/ui/button"
import { CrossSellModal } from "@/components/CrossSellModal"
import { useI18n } from "@/lib/i18n/context"
import { ShoppingCart, Zap } from "lucide-react"

const GOURDE_PRODUCT_ID = "gourde-connectee-thermosmart"

interface ProductActionsProps {
  product: Product
  variant: ProductVariant
}

export function ProductActions({ product, variant }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { t } = useI18n()
  const [crossSellOpen, setCrossSellOpen] = useState(false)

  const handleAdd = (showCrossSell: boolean) => {
    addItem(product, variant)
    if (showCrossSell && product.id === GOURDE_PRODUCT_ID) setCrossSellOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 rounded-xl min-h-[48px] h-12 font-semibold gap-2 touch-manipulation"
          onClick={() => handleAdd(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          {t("product.addToCart") as string}
        </Button>
        <Button size="lg" className="flex-1 rounded-xl min-h-[48px] h-12 font-semibold gap-2 touch-manipulation" asChild>
          <Link
            href="/panier"
            onClick={(e) => {
              handleAdd(true)
              if (product.id === GOURDE_PRODUCT_ID) e.preventDefault()
            }}
          >
            <Zap className="h-5 w-5" />
            {t("product.buyNow") as string}
          </Link>
        </Button>
      </div>
      <CrossSellModal open={crossSellOpen} onOpenChange={setCrossSellOpen} />
    </div>
  )
}
