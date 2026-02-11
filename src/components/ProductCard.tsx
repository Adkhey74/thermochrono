"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product, ProductVariant } from "@/types/product"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"
import { getProductDisplay } from "@/lib/i18n/product-display"

interface ProductCardProps {
  product: Product
  variant?: ProductVariant
  className?: string
}

export function ProductCard({ product, variant: variantProp, className }: ProductCardProps) {
  const { t } = useI18n()
  const variant = variantProp ?? product.variants[0]
  const display = getProductDisplay(product, t, variant)
  const imageSrc = variant?.images?.[0]
  const imageSrcHover = variant?.images?.[1]
  const href = product?.slug ? `/produit/${product.slug}` : "/boutique"

  return (
    <Card className={cn("group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 pt-0 flex flex-col h-full", className)}>
      <Link href={href} className="flex flex-col flex-1 min-h-0">
        <div className="relative aspect-[3/4] shrink-0 overflow-hidden rounded-t-2xl bg-card flex items-center justify-center">
          {imageSrc ? (
            <>
              <Image
                src={imageSrc}
                alt={display.name}
                fill
                className={cn(
                  "object-contain object-center p-6 sm:p-8 transition-all duration-300 ease-out",
                  imageSrcHover && "group-hover:opacity-0 group-hover:scale-110"
                )}
                sizes="(max-width: 768px) 100vw, 320px"
              />
              {imageSrcHover && (
                <Image
                  src={imageSrcHover}
                  alt=""
                  fill
                  className="absolute inset-0 object-contain object-center p-6 sm:p-8 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ease-out"
                  sizes="(max-width: 768px) 100vw, 320px"
                  aria-hidden
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm" aria-hidden>
              {display.name}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 min-h-0 px-6 pt-4 pb-3">
          <CardHeader className="p-0 pb-2 transition-colors duration-200 group-hover:text-foreground">
            <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">{display.name}</h3>
            <p className="text-lg font-semibold text-primary">{variant.price.toFixed(2)} €</p>
          </CardHeader>
          <CardContent className="p-0 pt-4 mt-auto">
            <Button className="w-full min-h-[48px] touch-manipulation transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-sm group-hover:shadow-md">
              {t("home.viewProduct") as string}
            </Button>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}
