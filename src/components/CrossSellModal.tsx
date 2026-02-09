"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { getProductBySlug } from "@/data/products"
import { ChevronRight } from "lucide-react"

interface CrossSellModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STICKERS_SLUG = "stickers-gourde-wanted"
const TASSE_SLUG = "tasse-connectee-thermosmart-200ml"

export function CrossSellModal({ open, onOpenChange }: CrossSellModalProps) {
  const { t } = useI18n()
  const router = useRouter()
  const stickersProduct = getProductBySlug(STICKERS_SLUG)
  const tasseProduct = getProductBySlug(TASSE_SLUG)

  const handleViewCart = () => {
    onOpenChange(false)
    router.push("/panier")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-md sm:max-w-lg" aria-labelledby="cross-sell-title">
        <div className="flex items-start justify-between p-4 sm:p-5 pb-2">
          <DialogHeader>
            <DialogTitle id="cross-sell-title" className="text-lg sm:text-xl font-bold pr-8">
              {t("cart.crossSellTitle") as string}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {t("cart.crossSellDescription") as string}
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            onClose={() => onOpenChange(false)}
            className="absolute right-3 top-3 rounded-lg p-1.5 hover:bg-muted"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 px-4 sm:px-5 pb-4">
          {stickersProduct && (
            <Link
              href={`/produit/${STICKERS_SLUG}`}
              onClick={() => onOpenChange(false)}
              className="flex flex-col rounded-xl border border-border/80 bg-muted/30 overflow-hidden hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="relative aspect-square">
                {stickersProduct.variants[0]?.images?.[0] && (
                  <Image
                    src={stickersProduct.variants[0].images[0]}
                    alt=""
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-200"
                    sizes="160px"
                  />
                )}
              </div>
              <div className="p-3 pt-0">
                <p className="font-semibold text-sm text-foreground line-clamp-2">
                  {t("cart.crossSellStickers") as string}
                </p>
                <p className="text-primary font-semibold text-sm mt-0.5">
                  {stickersProduct.variants[0]?.price.toFixed(2)} €
                </p>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary mt-1">
                  {t("home.viewProduct") as string}
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          )}
          {tasseProduct && (
            <Link
              href={`/produit/${TASSE_SLUG}`}
              onClick={() => onOpenChange(false)}
              className="flex flex-col rounded-xl border border-border/80 bg-muted/30 overflow-hidden hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="relative aspect-square">
                {tasseProduct.variants[0]?.images?.[0] && (
                  <Image
                    src={tasseProduct.variants[0].images[0]}
                    alt=""
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-200"
                    sizes="160px"
                  />
                )}
              </div>
              <div className="p-3 pt-0">
                <p className="font-semibold text-sm text-foreground line-clamp-2">
                  {t("cart.crossSellCup") as string}
                </p>
                <p className="text-primary font-semibold text-sm mt-0.5">
                  {tasseProduct.variants[0]?.price.toFixed(2)} €
                </p>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary mt-1">
                  {t("home.viewProduct") as string}
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          )}
        </div>
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border/60">
          <Button
            onClick={handleViewCart}
            className="w-full min-h-[48px] font-semibold rounded-xl"
          >
            {t("cart.crossSellViewCart") as string}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
