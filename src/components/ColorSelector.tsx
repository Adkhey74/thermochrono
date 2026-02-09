"use client"

import { cn } from "@/lib/utils"
import type { Product, ProductVariant } from "@/types/product"
import { useI18n } from "@/lib/i18n/context"
import { getProductDisplay } from "@/lib/i18n/product-display"

const colorToClass: Record<string, string> = {
  "Bleu pastel": "bg-sky-200",
  "Pastel blue": "bg-sky-200",
  Noir: "bg-gray-900",
  Black: "bg-gray-900",
  Blanc: "bg-white border-2 border-gray-300",
  White: "bg-white border-2 border-gray-300",
  Rouge: "bg-rose-200",
  Red: "bg-rose-200",
  Violet: "bg-violet-200",
  Rose: "bg-pink-200",
}

interface ColorSelectorProps {
  product: Product
  selectedVariant: ProductVariant
  onSelectVariant: (variant: ProductVariant) => void
}

export function ColorSelector({ product, selectedVariant, onSelectVariant }: ColorSelectorProps) {
  const { t } = useI18n()
  const colorLabel = t("product.color") as string
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {colorLabel}
      </span>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {product.variants.map((variant) => {
            const isCurrent = variant.id === selectedVariant.id
            const display = getProductDisplay(product, t, variant)
            const colorClass =
              colorToClass[variant.color] ?? colorToClass[display.color] ?? "bg-gray-400"
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelectVariant(variant)}
                title={display.color || variant.color}
                className={cn(
                  "h-11 w-11 min-h-[44px] min-w-[44px] rounded-full transition-transform duration-200 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation active:scale-95",
                  colorClass,
                  isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
                aria-label={`${colorLabel} ${display.color || variant.color}${isCurrent ? (t("product.selectedSuffix") as string) : ""}`}
                aria-current={isCurrent ? "true" : undefined}
              />
            )
          })}
        </div>
        <span className="text-sm font-medium text-foreground">
          {getProductDisplay(product, t, selectedVariant).color || selectedVariant.color}
        </span>
      </div>
    </div>
  )
}
