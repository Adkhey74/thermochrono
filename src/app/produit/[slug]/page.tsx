"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug } from "@/data/products"
import { ProductGallery } from "@/components/ProductGallery"
import { ProductActions } from "./ProductActions"
import { ColorSelector } from "@/components/ColorSelector"
import { ChevronRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { getProductDisplay } from "@/lib/i18n/product-display"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params)
  const { t } = useI18n()
  const product = getProductBySlug(slug)
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0])

  if (!product) notFound()
  if (!selectedVariant) notFound()

  const display = getProductDisplay(product, t, selectedVariant)

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8 sm:py-10 max-w-6xl">
        <nav
          className="mb-6 sm:mb-10 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
          aria-label={t("common.breadcrumbAria") as string}
        >
          <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors duration-200 ease-out touch-manipulation">
            {t("product.breadcrumbHome") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href="/boutique" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors duration-200 ease-out touch-manipulation">
            {t("home.boutiqueTitle") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[180px] sm:max-w-none">
            {display.name}
            {display.color ? ` — ${display.color}` : ""}
          </span>
        </nav>

        <div className="rounded-2xl bg-card overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-0">
            <div className="p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24 bg-muted/20">
              <ProductGallery images={selectedVariant.images} productName={display.name} />
            </div>

            <div className="flex flex-col gap-0 p-4 sm:p-6 lg:p-8 lg:pl-8 min-w-0">
              <section className="pb-6 lg:pb-8 border-b border-border/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                  {t("product.badgeBrand") as string}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {display.name}
                </h1>
                <p className="mt-3 text-2xl sm:text-3xl font-bold text-primary">
                  {selectedVariant.price.toFixed(2)} €
                </p>
              </section>

              <section className="py-6 lg:py-8 border-b border-border/60">
                <ColorSelector
                  product={product}
                  selectedVariant={selectedVariant}
                  onSelectVariant={setSelectedVariant}
                />
              </section>

              <section className="py-6 lg:py-8">
                <ProductActions product={product} variant={selectedVariant} />
              </section>

              <section className="py-6 lg:py-8 border-t border-border/60">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("product.description") as string}
                </h2>
                <p className="text-foreground leading-relaxed text-[15px]">
                  {display.description}
                </p>
              </section>

              <section className="pt-6 lg:pt-8">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("product.features") as string}
                </h2>
                <ul className="space-y-3">
                  {display.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
